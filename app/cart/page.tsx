'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/app/cart-context'
import { useAuth } from '@/app/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { session } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">
            Shopping Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-12">
              <p className="text-xl text-muted-foreground mb-6">
                Your cart is empty
              </p>
              <Link href="/">
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  Shop Threads
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={`${item.productId}-${item.color}`}>
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-muted-foreground text-xs">
                            No img
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground">
                          {item.productName}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-border"
                            style={{ backgroundColor: item.colorCode }}
                          ></div>
                          <span className="text-sm text-muted-foreground">
                            {item.color}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-foreground mt-2">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.productId, item.color)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>

                        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.color,
                                item.quantity - 1
                              )
                            }
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.color,
                                item.quantity + 1
                              )
                            }
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-lg font-bold text-foreground">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit sticky top-24">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Order Summary
                  </h2>

                  <div className="space-y-2 border-b border-border pb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-semibold">
                        ${total > 50 ? '0.00' : '5.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-semibold">
                        ${(total * 0.1).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-accent">
                      $
                      {(
                        total +
                        (total > 50 ? 0 : 5) +
                        total * 0.1
                      ).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-accent hover:bg-accent/90 text-white text-lg py-6"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>

                  {!session && (
                    <p className="text-sm text-muted-foreground text-center pt-2">
                      You&apos;ll need to login to checkout
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Promo */}
              <Card className="mt-4 bg-secondary/50">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    💡 Free shipping on orders over $50
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                    />
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
