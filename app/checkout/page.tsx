'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/app/cart-context'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Check, Truck, CreditCard, Smartphone, DollarSign } from 'lucide-react'

type PaymentMethod = 'cod' | 'upi'
type ShippingType = 'standard' | 'express'
type Address = { firstName: string; lastName: string; email: string; phone: string; street: string; city: string; postalCode: string }

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)
const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
const FREE_SHIPPING_THRESHOLD = 50000

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart, loading: cartLoading } = useCart()
  const { session, loading: authLoading } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [shippingType, setShippingType] = useState<ShippingType>('standard')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [placedTotal, setPlacedTotal] = useState(0)
  const [idempotencyKey, setIdempotencyKey] = useState('')

  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID())
  }, [])

  useEffect(() => {
    if (!authLoading && !session) router.replace('/login')
  }, [authLoading, session, router])

  useEffect(() => {
    if (!cartLoading && items.length === 0 && !orderPlaced) router.replace('/cart')
  }, [cartLoading, items.length, orderPlaced, router])

  const shippingCost = shippingType === 'express' ? 1500 : total >= FREE_SHIPPING_THRESHOLD ? 0 : 500
  const tax = Math.round(total * 0.18 * 100) / 100
  const finalTotal = total + shippingCost + tax

  async function handlePlaceOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!session || !idempotencyKey || !items.length) return
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const address: Address = {
      firstName: String(form.get('firstName') ?? '').trim(),
      lastName: String(form.get('lastName') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      street: String(form.get('street') ?? '').trim(),
      city: String(form.get('city') ?? '').trim(),
      postalCode: String(form.get('postalCode') ?? '').trim(),
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          items: items.map(({ productId, color, quantity }) => ({ productId, color, quantity })),
          address,
          shippingType,
          paymentMethod,
          idempotencyKey,
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not place your order.')
      clearCart()
      setOrderId(result.orderId)
      setPlacedTotal(Number(result.total))
      setOrderPlaced(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not place your order. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <Card><CardContent className="space-y-6 p-8 text-center sm:p-12">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-8" aria-hidden="true" /></div>
            <div><h1 className="text-3xl font-semibold tracking-tight">Order confirmed</h1><p className="mt-2 text-muted-foreground">Thank you. Your order has been received.</p></div>
            <div className="rounded-lg border bg-muted/40 p-5 text-left"><p className="text-sm text-muted-foreground">Order number</p><p className="mt-1 break-all font-mono text-sm">{orderId}</p><div className="mt-4 flex items-center justify-between"><span className="text-muted-foreground">Total</span><span className="text-xl font-semibold">{formatINR(placedTotal)}</span></div><p className="mt-3 text-sm text-muted-foreground">Payment: {paymentMethod === 'cod' ? 'Cash on delivery' : 'UPI (payment pending)'}</p></div>
            {paymentMethod === 'upi' && <p className="text-sm text-muted-foreground">Your order is recorded as pending. The seller will share UPI payment instructions before fulfillment.</p>}
            <div className="flex flex-col justify-center gap-3 sm:flex-row"><Link href="/account"><Button>View account</Button></Link><Link href="/"><Button variant="outline">Continue shopping</Button></Link></div>
          </CardContent></Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Back to cart</Link>
        <div className="mb-8"><p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">ThreadHub checkout</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Delivery & payment</h1></div>

        <form onSubmit={handlePlaceOrder} className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card><CardContent className="p-6">
              <h2 className="text-lg font-semibold">Shipping address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-1.5 text-sm font-medium">First name<input className={inputClass} name="firstName" autoComplete="given-name" required maxLength={100} /></label>
                <label className="space-y-1.5 text-sm font-medium">Last name<input className={inputClass} name="lastName" autoComplete="family-name" required maxLength={100} /></label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Email<input className={inputClass} name="email" type="email" autoComplete="email" defaultValue={session?.user.email ?? ''} required maxLength={200} /></label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Phone number<input className={inputClass} name="phone" type="tel" autoComplete="tel" required maxLength={30} /></label>
                <label className="space-y-1.5 text-sm font-medium sm:col-span-2">Street address<input className={inputClass} name="street" autoComplete="street-address" required maxLength={200} /></label>
                <label className="space-y-1.5 text-sm font-medium">City<input className={inputClass} name="city" autoComplete="address-level2" required maxLength={100} /></label>
                <label className="space-y-1.5 text-sm font-medium">Postal code<input className={inputClass} name="postalCode" autoComplete="postal-code" required maxLength={20} /></label>
              </div>
            </CardContent></Card>

            <Card><CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><Truck className="size-5" aria-hidden="true" /> Shipping method</h2>
              <div className="mt-4 space-y-3">
                {([{ id: 'standard', name: 'Standard shipping', time: '5–7 business days', cost: total >= FREE_SHIPPING_THRESHOLD ? 0 : 500 }, { id: 'express', name: 'Express shipping', time: '2–3 business days', cost: 1500 }] as const).map((method) => <label key={method.id} className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 ${shippingType === method.id ? 'border-primary bg-primary/5' : 'border-border'}`}><input type="radio" name="shipping" value={method.id} checked={shippingType === method.id} onChange={() => setShippingType(method.id)} /><span className="flex-1"><span className="block font-medium">{method.name}</span><span className="text-sm text-muted-foreground">{method.time}</span></span><span className="font-medium">{method.cost ? formatINR(method.cost) : 'Free'}</span></label>)}
              </div>
            </CardContent></Card>

            <Card><CardContent className="p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold"><CreditCard className="size-5" aria-hidden="true" /> Payment method</h2>
              <div className="mt-4 space-y-3">
                <label className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border'}`}><input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /><DollarSign className="size-5 text-primary" aria-hidden="true" /><span><span className="block font-medium">Cash on delivery</span><span className="text-sm text-muted-foreground">Pay when your order arrives</span></span></label>
                <label className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 ${paymentMethod === 'upi' ? 'border-primary bg-primary/5' : 'border-border'}`}><input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} /><Smartphone className="size-5 text-primary" aria-hidden="true" /><span><span className="block font-medium">UPI transfer</span><span className="text-sm text-muted-foreground">Payment instructions are shared after order confirmation</span></span></label>
              </div>
            </CardContent></Card>
          </div>

          <aside className="lg:sticky lg:top-6"><Card><CardContent className="space-y-5 p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="max-h-64 space-y-3 overflow-y-auto">{items.map((item) => <div key={`${item.productId}-${item.color}`} className="flex justify-between gap-3 text-sm"><span className="min-w-0 text-muted-foreground">{item.productName} · {item.color} × {item.quantity}</span><span className="shrink-0 font-medium">{formatINR(item.price * item.quantity)}</span></div>)}</div>
            <div className="space-y-2 border-y py-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(total)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shippingCost ? formatINR(shippingCost) : 'Free'}</span></div><div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatINR(tax)}</span></div></div>
            <div className="flex items-center justify-between"><span className="font-semibold">Total</span><span className="text-xl font-semibold">{formatINR(finalTotal)}</span></div>
            {error && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy || !idempotencyKey || cartLoading} className="w-full">{busy ? 'Placing order…' : 'Place order'}</Button>
            <p className="text-center text-xs text-muted-foreground">Prices and stock are verified when you place your order.</p>
          </CardContent></Card></aside>
        </form>
      </div>
    </main>
  )
}
