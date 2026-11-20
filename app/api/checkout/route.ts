import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const MAX_ORDER_QUANTITY = 10000
const FREE_SHIPPING_THRESHOLD = 50000

function isValidAddress(address: unknown): address is Record<string, string> {
  if (!address || typeof address !== 'object') return false
  const fields = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'postalCode']
  return fields.every((field) => {
    const value = (address as Record<string, unknown>)[field]
    return typeof value === 'string' && value.trim().length > 0 && value.length <= 200
  })
}

export async function POST(request: Request) {
  const authorization = request.headers.get('authorization')
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!accessToken) return NextResponse.json({ error: 'Sign in to place an order.' }, { status: 401 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !anonKey || !serviceRoleKey) {
    return NextResponse.json({ error: 'Checkout is temporarily unavailable.' }, { status: 503 })
  }

  const authClient = createClient(url, anonKey, { auth: { persistSession: false }, global: { headers: { Authorization: `Bearer ${accessToken}` } } })
  const { data: authData, error: authError } = await authClient.auth.getUser()
  if (authError || !authData.user) return NextResponse.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401 })

  let body: {
    items?: Array<{ productId?: string; color?: string; quantity?: number }>
    address?: unknown
    shippingType?: string
    paymentMethod?: string
    idempotencyKey?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid checkout request.' }, { status: 400 })
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 100 || !isValidAddress(body.address)) {
    return NextResponse.json({ error: 'Check your delivery details and cart items.' }, { status: 400 })
  }
  if (!['standard', 'express'].includes(body.shippingType ?? '') || !['cod', 'upi'].includes(body.paymentMethod ?? '')) {
    return NextResponse.json({ error: 'Choose a valid shipping and payment method.' }, { status: 400 })
  }
  if (!body.idempotencyKey || !/^[\da-f-]{36}$/i.test(body.idempotencyKey)) {
    return NextResponse.json({ error: 'Refresh checkout and try again.' }, { status: 400 })
  }

  const itemsByKey = new Map<string, { productId: string; color: string; quantity: number }>()
  for (const item of body.items) {
    if (typeof item.productId !== 'string' || !/^[\da-f-]{36}$/i.test(item.productId) || typeof item.color !== 'string' || item.color.length > 100 || !Number.isSafeInteger(item.quantity) || Number(item.quantity) <= 0 || Number(item.quantity) > MAX_ORDER_QUANTITY) {
      return NextResponse.json({ error: 'One or more cart quantities are invalid.' }, { status: 400 })
    }
    const key = `${item.productId}:${item.color}`
    const current = itemsByKey.get(key)
    const quantity = (current?.quantity ?? 0) + Number(item.quantity)
    if (quantity > MAX_ORDER_QUANTITY) return NextResponse.json({ error: 'The requested quantity is too large.' }, { status: 400 })
    itemsByKey.set(key, { productId: item.productId, color: item.color, quantity })
  }

  const admin = createClient(url, serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } })
  const { data: existingOrder, error: existingError } = await admin
    .from('orders')
    .select('id,total_price')
    .eq('user_id', authData.user.id)
    .eq('idempotency_key', body.idempotencyKey)
    .maybeSingle()
  if (existingError) return NextResponse.json({ error: 'Could not verify your order. Please try again.' }, { status: 500 })
  if (existingOrder) return NextResponse.json({ orderId: existingOrder.id, total: Number(existingOrder.total_price) })

  const requestedItems = [...itemsByKey.values()]
  const productIds = [...new Set(requestedItems.map((item) => item.productId))]
  const { data: products, error: productsError } = await admin
    .from('products')
    .select('id,price,stock,moq')
    .in('id', productIds)
  if (productsError || !products || products.length !== productIds.length) {
    return NextResponse.json({ error: 'A product in your cart is no longer available.' }, { status: 409 })
  }

  const productById = new Map(products.map((product) => [product.id, product]))
  const productTotals = new Map<string, number>()
  for (const item of requestedItems) productTotals.set(item.productId, (productTotals.get(item.productId) ?? 0) + item.quantity)
  for (const [productId, quantity] of productTotals) {
    const product = productById.get(productId)
    if (!product || quantity < Number(product.moq ?? 1) || quantity > Number(product.stock)) {
      return NextResponse.json({ error: 'A cart item no longer meets the minimum order quantity or available stock.' }, { status: 409 })
    }
  }

  const subtotal = requestedItems.reduce((sum, item) => sum + Number(productById.get(item.productId)?.price) * item.quantity, 0)
  if (!Number.isFinite(subtotal) || subtotal <= 0) return NextResponse.json({ error: 'The cart total is invalid.' }, { status: 400 })
  const shippingCost = body.shippingType === 'express' ? 1500 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 500
  const tax = Math.round(subtotal * 0.18 * 100) / 100
  const total = Math.round((subtotal + shippingCost + tax) * 100) / 100

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      user_id: authData.user.id,
      total_price: total,
      payment_method: body.paymentMethod?.toUpperCase() ?? '',
      status: 'pending',
      shipping_address: body.address,
      shipping_type: body.shippingType,
      idempotency_key: body.idempotencyKey,
    })
    .select('id')
    .single()
  if (orderError || !order) return NextResponse.json({ error: 'Your order could not be placed. Please try again.' }, { status: 500 })

  const { error: itemsError } = await admin.from('order_items').insert(requestedItems.map((item) => ({
    order_id: order.id,
    product_id: item.productId,
    color: item.color,
    quantity: item.quantity,
    price: Number(productById.get(item.productId)?.price),
  })))
  if (itemsError) {
    await admin.from('orders').delete().eq('id', order.id).eq('user_id', authData.user.id)
    return NextResponse.json({ error: 'Your order could not be completed. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ orderId: order.id, total })
}
