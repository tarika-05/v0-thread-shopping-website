'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useAuth } from '@/app/auth-context'
import { useWishlist } from '@/app/wishlist-context'
import { useCart } from '@/app/cart-context'
import { Button } from '@/components/ui/button'
import { formatINR, galleryPanelStyle, ThreadHubProduct } from '@/lib/threadhub'

export function ProductCard({ product }: { product: ThreadHubProduct }) {
  const router = useRouter()
  const { session } = useAuth()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addItem } = useCart()
  const image = product.product_images?.[0]
  const bulkTier = product.bulk_pricing?.[0]
  const inStock = product.stock > 0

  const handleWishlist = () => {
    if (!session) {
      router.push('/login?next=/wishlist')
      return
    }
    void toggleWishlist(product.id)
  }

  const handleAddToCart = () => {
    if (!inStock || !image) return
    addItem({
      productId: product.id,
      productName: product.name,
      color: image.color,
      colorCode: image.color_code,
      price: product.price,
      quantity: Math.max(1, Number(product.moq ?? 1)),
      image: image.image_url,
      imageOrder: image.order,
      moq: Math.max(1, Number(product.moq ?? 1)),
      stock: product.stock,
    })
  }

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Link
          href={`/product/${product.id}`}
          className="absolute inset-0"
          aria-label={`View ${product.name}`}
        >
          {image ? (
            <div
              role="img"
              aria-label={`${product.name}, ${image.color}`}
              className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]"
              style={galleryPanelStyle(image.image_url, image.order)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Image unavailable</div>
          )}
        </Link>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={isInWishlist(product.id)}
          className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2.5 text-slate-900 shadow-sm transition-colors hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600"
        >
          <Heart aria-hidden="true" className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-orange-600 text-orange-600' : ''}`} />
        </button>
        <span className={`absolute bottom-3 left-3 rounded-sm px-2 py-1 text-[11px] font-medium ${inStock ? 'bg-white/95 text-slate-900' : 'bg-slate-900/85 text-white'}`}>
          {inStock ? `${product.stock} available` : 'Out of stock'}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {product.category ?? 'Textile'}
          </span>
          {product.sku && <span className="text-[11px] text-muted-foreground">{product.sku}</span>}
        </div>
        <Link href={`/product/${product.id}`} className="font-semibold leading-snug text-foreground hover:text-accent">
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star aria-hidden="true" className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
          <span className="font-medium text-foreground">{Number(product.rating ?? 0).toFixed(1)}</span>
          <span>({product.review_count ?? 0} reviews)</span>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 border-t border-border pt-3 text-xs">
          <div><dt className="text-muted-foreground">Material</dt><dd className="mt-0.5 line-clamp-1 font-medium">{product.material_type || product.material || '—'}</dd></div>
          <div><dt className="text-muted-foreground">Minimum order</dt><dd className="mt-0.5 font-medium">{product.moq ?? 1} cones</dd></div>
        </dl>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-lg font-semibold tracking-tight">{formatINR(product.price)}<span className="ml-1 text-xs font-normal text-muted-foreground">/ cone</span></p>
            {bulkTier && <p className="mt-1 text-[11px] text-emerald-700">{bulkTier.quantity}+ · {bulkTier.discount}% bulk saving</p>}
          </div>
          <Button type="button" onClick={handleAddToCart} disabled={!inStock || !image} size="sm" aria-label={`Add minimum order of ${product.name} to cart`}>
            <ShoppingBag aria-hidden="true" className="mr-1.5 h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </article>
  )
}
