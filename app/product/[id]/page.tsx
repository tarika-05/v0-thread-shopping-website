'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import useSWR from 'swr'
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useAuth } from '@/app/auth-context'
import { useCart } from '@/app/cart-context'
import { useWishlist } from '@/app/wishlist-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { fetchThreadHubProducts, formatINR, galleryPanelStyle } from '@/lib/threadhub'
import { ProductCard } from '@/components/product-card'

export default function ProductPage() {
  const params = useParams<{ id: string }>()
  const productId = params.id
  const router = useRouter()
  const { session } = useAuth()
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const { data: products = [], error, isLoading } = useSWR('threadhub-products', fetchThreadHubProducts)
  const product = products.find((item) => item.id === productId)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState<number | null>(null)
  const images = product?.product_images ?? []
  const selectedImage = images[selectedImageIndex] ?? images[0]
  const minimum = Math.max(1, Number(product?.moq ?? 1))
  const available = Number(product?.stock ?? 0)
  const orderQuantity = quantity ?? minimum
  const related = useMemo(() => product ? products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4) : [], [product, products])

  if (isLoading) return <main className="mx-auto min-h-[60vh] max-w-7xl animate-pulse px-4 py-12"><div className="h-5 w-32 rounded bg-secondary" /><div className="mt-8 grid gap-8 md:grid-cols-2"><div className="aspect-square rounded-lg bg-secondary" /><div className="space-y-4"><div className="h-8 w-2/3 rounded bg-secondary" /><div className="h-5 w-1/2 rounded bg-secondary" /><div className="h-32 rounded bg-secondary" /></div></div></main>
  if (error) return <main className="mx-auto max-w-7xl px-4 py-16 text-center"><h1 className="text-2xl font-semibold">Product unavailable</h1><p className="mt-2 text-muted-foreground">We couldn&apos;t load this product right now.</p><Link href="/browse"><Button className="mt-6">Back to catalog</Button></Link></main>
  if (!product) return <main className="mx-auto max-w-7xl px-4 py-16 text-center"><h1 className="text-2xl font-semibold">Product not found</h1><p className="mt-2 text-muted-foreground">This product may have been removed from the catalog.</p><Link href="/browse"><Button className="mt-6">Browse products</Button></Link></main>

  const canOrder = available >= minimum
  const handleAddToCart = () => {
    if (!selectedImage || !canOrder || orderQuantity < minimum || orderQuantity > available) return
    addItem({ productId: product.id, productName: product.name, color: selectedImage.color, colorCode: selectedImage.color_code, price: product.price, quantity: orderQuantity, image: selectedImage.image_url, imageOrder: selectedImage.order, moq: minimum, stock: available })
  }
  const handleWishlist = () => {
    if (!session) {
      router.push(`/login?next=${encodeURIComponent(`/product/${product.id}`)}`)
      return
    }
    void toggleWishlist(product.id)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/browse" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Back to catalog</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <section aria-label="Product images" className="min-w-0">
            <div className="aspect-square overflow-hidden rounded-xl border border-border bg-secondary">
              {selectedImage ? <div role="img" aria-label={`${product.name}, ${selectedImage.color}`} className="h-full w-full" style={galleryPanelStyle(selectedImage.image_url, selectedImage.order)} /> : <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Product image unavailable</div>}
            </div>
            {images.length > 1 && <div className="mt-3 grid grid-cols-4 gap-3">{images.map((image, index) => <button key={`${image.color}-${image.order}`} type="button" onClick={() => setSelectedImageIndex(index)} aria-label={`View ${image.color} image`} aria-pressed={selectedImageIndex === index} className={`aspect-square overflow-hidden rounded-lg border-2 bg-secondary ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'}`}><div className="h-full w-full" role="img" aria-label={`${image.color} yarn`} style={galleryPanelStyle(image.image_url, image.order)} /></button>)}</div>}
          </section>

          <section className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{product.category ?? 'Textile'}{product.sku ? ` · SKU ${product.sku}` : ''}</p>
            <div className="mt-3 flex items-start justify-between gap-4"><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1><Button type="button" variant="outline" size="icon" aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isInWishlist(product.id)} onClick={handleWishlist}><Heart className={`size-5 ${isInWishlist(product.id) ? 'fill-rose-600 text-rose-600' : ''}`} /></Button></div>
            <p className="mt-4 text-3xl font-semibold tracking-tight">{formatINR(product.price)}<span className="ml-2 text-sm font-normal text-muted-foreground">per cone, before GST</span></p>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{product.description || 'Contact us for more product information.'}</p>
            <div className="mt-5 flex flex-wrap gap-2"><span className={`rounded-full px-3 py-1 text-sm font-medium ${available >= minimum ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>{available > 0 ? `${available} cones available` : 'Out of stock'}</span><span className="rounded-full bg-secondary px-3 py-1 text-sm">MOQ {minimum} cones</span></div>

            {images.length > 0 && <fieldset className="mt-7"><legend className="mb-3 text-sm font-semibold">Color: {selectedImage?.color}</legend><div className="flex flex-wrap gap-2">{images.map((image, index) => <button key={`color-${image.color}-${index}`} type="button" onClick={() => setSelectedImageIndex(index)} aria-label={`Select ${image.color}`} aria-pressed={selectedImage?.color === image.color} className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${selectedImageIndex === index ? 'border-primary bg-primary/5' : 'border-border'}`}><span className="size-4 rounded-full border border-black/10" style={{ backgroundColor: image.color_code }} aria-hidden="true" />{image.color}</button>)}</div></fieldset>}

            <div className="mt-7"><label htmlFor="quantity" className="mb-2 block text-sm font-semibold">Order quantity</label><div className="flex flex-wrap items-center gap-3"><div className="inline-flex items-center rounded-md border border-border"><Button type="button" variant="ghost" size="icon" aria-label="Decrease quantity" disabled={orderQuantity <= minimum} onClick={() => setQuantity(Math.max(minimum, orderQuantity - 1))}><Minus className="size-4" /></Button><input id="quantity" type="number" min={minimum} max={available} value={orderQuantity} onChange={(event) => setQuantity(Number(event.target.value))} className="w-20 bg-transparent text-center text-sm font-medium outline-none" /><Button type="button" variant="ghost" size="icon" aria-label="Increase quantity" disabled={orderQuantity >= available} onClick={() => setQuantity(Math.min(available, orderQuantity + 1))}><Plus className="size-4" /></Button></div><span className="text-xs text-muted-foreground">Minimum order: {minimum} cones</span></div></div>
            <Button type="button" onClick={handleAddToCart} disabled={!selectedImage || !canOrder || orderQuantity < minimum || orderQuantity > available} className="mt-5 w-full sm:w-auto"><ShoppingBag className="mr-2 size-4" aria-hidden="true" /> Add {orderQuantity} to cart</Button>
            {!canOrder && <p role="status" className="mt-2 text-sm text-destructive">There is not enough stock to meet the minimum order quantity.</p>}

            <Card className="mt-8"><CardContent className="p-5"><h2 className="text-base font-semibold">Technical specifications</h2><dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 text-sm">{[["Material", product.material_type || product.material], ["Weight", product.weight_grams != null ? `${product.weight_grams} g` : null], ["Thickness", product.thickness_mm != null ? `${product.thickness_mm} mm` : null], ["Tensile strength", product.tensile_strength || (product.tensile_strength_mpa != null ? `${product.tensile_strength_mpa} MPa` : null)], ["Cone size", product.cone_size], ["SKU", product.sku], ["Available stock", `${available} cones`], ["Minimum order", `${minimum} cones`]].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-medium">{value || '—'}</dd></div>)}</dl></CardContent></Card>

            {!!product.bulk_pricing?.length && <Card className="mt-4"><CardContent className="p-5"><h2 className="text-base font-semibold">Bulk pricing</h2><div className="mt-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th scope="col" className="py-2 pr-4 font-medium">Quantity</th><th scope="col" className="py-2 pr-4 font-medium">Unit price</th><th scope="col" className="py-2 font-medium">Savings</th></tr></thead><tbody>{product.bulk_pricing.map((tier) => <tr key={tier.quantity} className="border-b border-border last:border-0"><th scope="row" className="py-3 pr-4 font-medium">{tier.quantity}+</th><td className="py-3 pr-4">{formatINR(tier.unit_price)}</td><td className="py-3 text-emerald-700">{tier.discount}%</td></tr>)}</tbody></table></div></CardContent></Card>}
          </section>
        </div>

        {!!related.length && <section className="mt-16 border-t border-border pt-10" aria-labelledby="related-heading"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Keep exploring</p><h2 id="related-heading" className="mt-2 text-2xl font-semibold">Related materials</h2></div><Link href={`/browse?category=${product.category ?? ''}`} className="text-sm font-medium hover:text-accent">View category</Link></div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
      </div>
    </main>
  )
}
