'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/cart-context'
import { useAuth } from '@/app/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Check, Truck, CreditCard, Smartphone, DollarSign } from 'lucide-react'
import Link from 'next/link'

type PaymentMethod = 'cod' | 'upi' | 'card' | null
type ShippingType = 'standard' | 'express'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { session } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [shippingType, setShippingType] = useState<ShippingType>('standard')
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  // Redirect if no session
  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/cart')
    }
  }, [items.length, orderPlaced, router])

  const shippingCost = shippingType === 'express' ? 15 : total > 50 ? 0 : 5
  const tax = total * 0.18
  const finalTotal = total + shippingCost + tax

  const handlePlaceOrder = async () => {
    if (!paymentMethod || !session) return

    setLoading(true)
    try {
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total_price: finalTotal,
          payment_method: paymentMethod.toUpperCase(),
          status: 'pending',
        })
        .select('id')
        .single()

      if (orderError) throw orderError

      const newOrderId = orderData.id

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: newOrderId,
        product_id: item.productId,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart and show success
      clearCart()
      setOrderId(newOrderId)
      setOrderPlaced(true)
    } catch (error) {
      console.error('[v0] Order placement error:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced && orderId) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-green-500">
            <CardContent className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Order Placed Successfully!
                </h1>
                <p className="text-muted-foreground">
                  Thank you for your purchase.
                </p>
              </div>

              <Card className="bg-secondary/50">
                <CardContent className="p-6">
                  <div className="text-left space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Number
                      </p>
                      <p className="font-bold text-foreground">{orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Amount
                      </p>
                      <p className="text-2xl font-bold text-accent">
                        ${finalTotal.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-bold text-foreground">
                        Processing Your Order
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  A confirmation email has been sent to {session?.user?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  You can track your order from your account.
                </p>
              </div>

              <div className="flex gap-4 justify-center pt-4">
                <Link href="/account">
                  <Button className="bg-accent hover:bg-accent/90 text-white">
                    View Orders
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Continue Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/cart">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Cart
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Shipping Address
                </h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="col-span-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="col-span-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Email"
                    defaultValue={session?.user?.email || ''}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Street Address"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="col-span-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      className="col-span-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Shipping Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6" />
                  Shipping Method
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      id: 'standard',
                      name: 'Standard Shipping',
                      time: '5-7 business days',
                      cost: total > 50 ? 0 : 5,
                    },
                    {
                      id: 'express',
                      name: 'Express Shipping',
                      time: '2-3 business days',
                      cost: 15,
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                      style={{
                        borderColor:
                          shippingType === method.id ? '#c87137' : '#e8e3db',
                        backgroundColor:
                          shippingType === method.id
                            ? 'rgba(200, 113, 55, 0.05)'
                            : 'transparent',
                      }}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={shippingType === method.id as any}
                        onChange={(e) =>
                          setShippingType(e.target.value as ShippingType)
                        }
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-foreground">
                          {method.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {method.time}
                        </p>
                      </div>
                      <p className="font-bold text-foreground">
                        {method.cost === 0 ? 'FREE' : `$${method.cost}`}
                      </p>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      id: 'cod',
                      name: 'Cash on Delivery (COD)',
                      desc: 'Pay when your order arrives',
                      icon: DollarSign,
                    },
                    {
                      id: 'upi',
                      name: 'UPI Payment',
                      desc: 'Google Pay, PhonePe, Paytm, etc.',
                      icon: Smartphone,
                    },
                    {
                      id: 'card',
                      name: 'Credit/Debit Card',
                      desc: 'Visa, Mastercard, American Express',
                      icon: CreditCard,
                    },
                  ].map((method) => {
                    const Icon = method.icon
                    return (
                      <label
                        key={method.id}
                        className="flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all"
                        style={{
                          borderColor:
                            paymentMethod === method.id
                              ? '#c87137'
                              : '#e8e3db',
                          backgroundColor:
                            paymentMethod === method.id
                              ? 'rgba(200, 113, 55, 0.05)'
                              : 'transparent',
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id as any}
                          onChange={(e) =>
                            setPaymentMethod(e.target.value as PaymentMethod)
                          }
                          className="w-4 h-4"
                        />
                        <Icon className="w-6 h-6 text-accent flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-bold text-foreground">
                            {method.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {method.desc}
                          </p>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="h-fit sticky top-24">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  Order Summary
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.color}`}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {item.productName} ({item.color}) x {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-b border-border py-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-foreground">
                    Total
                  </span>
                  <span className="text-3xl font-bold text-accent">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={!paymentMethod || loading}
                  className="w-full bg-accent hover:bg-accent/90 text-white text-lg py-6 disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>

                <div className="text-xs text-muted-foreground text-center pt-2 space-y-1">
                  <p>✓ Secure payment processing</p>
                  <p>✓ 30-day money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
