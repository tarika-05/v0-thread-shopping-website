'use client'

import Link from 'next/link'
import { useCart } from '@/app/cart-context'
import { useAuth } from '@/app/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'

const formatINR = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(amount)
const FREE_SHIPPING_THRESHOLD = 50000

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart, loading } = useCart()
  const { session } = useAuth()
  const router = useRouter()
  const tax = Math.round(total * 0.18 * 100) / 100
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 500

  const handleCheckout = () => {
    if (!session) {
      router.push('/login')
      return
    }
    router.push('/checkout')
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Continue shopping</Link>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary">ThreadHub</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Shopping cart</h1>
        </div>

        {loading ? <Card><CardContent className="p-12 text-center text-muted-foreground">Loading your saved cart…</CardContent></Card> : items.length === 0 ? (
          <Card><CardContent className="p-12 text-center"><p className="text-lg font-medium">Your cart is empty</p><p className="mt-2 text-sm text-muted-foreground">Browse the catalog to find yarns and threads for your next order.</p><Link href="/products"><Button className="mt-6">Browse products</Button></Link></CardContent></Card>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            <section aria-label="Cart items" className="space-y-4">
              {items.map((item) => {
                const minimum = Math.max(1, item.moq ?? 1)
                const maximum = item.stock ?? Number.MAX_SAFE_INTEGER
                const atStockLimit = item.quantity >= maximum
                return <Card key={`${item.productId}-${item.color}`}><CardContent className="flex gap-4 p-4 sm:gap-6 sm:p-6">
                  <div className="size-20 shrink-0 overflow-hidden rounded-md bg-muted sm:size-24">{item.image ? <img src={item.image} alt={item.productName} className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-xs text-muted-foreground">No image</div>}</div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold leading-snug">{item.productName}</h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><span className="size-4 rounded-full border" style={{ backgroundColor: item.colorCode }} aria-hidden="true" />{item.color}</div>
                    <p className="mt-2 text-sm font-medium">{formatINR(item.price)} <span className="font-normal text-muted-foreground">per unit</span></p>
                    <p className="mt-1 text-xs text-muted-foreground">MOQ {minimum} · {maximum} in stock</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <div className="inline-flex items-center rounded-md border">
                        <Button type="button" variant="ghost" size="icon" aria-label={`Decrease ${item.productName} quantity`} disabled={item.quantity <= minimum} onClick={() => updateQuantity(item.productId, item.color, Math.max(minimum, item.quantity - 1))}><Minus className="size-4" /></Button>
                        <span className="w-12 text-center text-sm font-medium" aria-live="polite">{item.quantity}</span>
                        <Button type="button" variant="ghost" size="icon" aria-label={`Increase ${item.productName} quantity`} disabled={atStockLimit} onClick={() => updateQuantity(item.productId, item.color, Math.min(maximum, item.quantity + 1))}><Plus className="size-4" /></Button>
                      </div>
                      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.productId, item.color)}><Trash2 className="mr-2 size-4" />Remove</Button>
                    </div>
                    {item.quantity < minimum && <p role="alert" className="mt-2 text-sm text-destructive">This product requires a minimum of {minimum} units.</p>}
                  </div>
                  <p className="shrink-0 text-right text-sm font-semibold sm:text-base">{formatINR(item.price * item.quantity)}</p>
                </CardContent></Card>
              })}
            </section>

            <aside className="lg:sticky lg:top-6"><Card><CardContent className="space-y-5 p-6">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="space-y-3 border-y py-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(total)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping ? formatINR(shipping) : 'Free'}</span></div><div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatINR(tax)}</span></div></div>
              <div className="flex items-center justify-between"><span className="font-semibold">Estimated total</span><span className="text-xl font-semibold">{formatINR(total + shipping + tax)}</span></div>
              <Button onClick={handleCheckout} className="w-full" disabled={items.some((item) => item.quantity < (item.moq ?? 1) || item.quantity > (item.stock ?? Number.MAX_SAFE_INTEGER))}>Proceed to checkout</Button>
              <Button type="button" variant="outline" className="w-full" onClick={clearCart}>Clear cart</Button>
              <p className="text-xs text-muted-foreground">18% GST applies. Standard shipping is free on orders over {formatINR(FREE_SHIPPING_THRESHOLD)}.</p>
              {!session && <p className="text-center text-sm text-muted-foreground">Sign in is required to place an order.</p>}
            </CardContent></Card></aside>
          </div>
        )}
      </div>
    </main>
  )
}
