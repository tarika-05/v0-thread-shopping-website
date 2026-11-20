'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useWishlist } from '@/app/wishlist-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

type WishlistedProduct = {
  id: string
  name: string
  price: number
  product_images?: { image_url: string }[]
}

export default function WishlistPage() {
  const { wishlist, loading: wishlistLoading, toggleWishlist } = useWishlist()
  const [products, setProducts] = useState<WishlistedProduct[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)

  useEffect(() => {
    let isActive = true

    async function loadProducts() {
      if (wishlistLoading) return
      if (wishlist.length === 0) {
        setProducts([])
        return
      }

      setLoadingProducts(true)
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, product_images(image_url)')
        .in('id', wishlist)

      if (isActive) {
        if (error) {
          console.error('Could not load wishlist products:', error)
          setProducts([])
        } else {
          setProducts((data ?? []) as WishlistedProduct[])
        }
        setLoadingProducts(false)
      }
    }

    loadProducts()
    return () => {
      isActive = false
    }
  }, [wishlist, wishlistLoading])

  const isLoading = wishlistLoading || loadingProducts

  return (
    <main className="min-h-[60vh] bg-background">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Saved for later</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your wishlist</h1>
            <p className="mt-2 text-sm text-muted-foreground">Keep your preferred yarns close at hand.</p>
          </div>
          <Heart aria-hidden="true" className="hidden h-8 w-8 text-accent sm:block" />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4" aria-label="Loading wishlist">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-secondary" />
                <div className="mt-3 h-4 w-3/4 bg-secondary" />
                <div className="mt-2 h-4 w-1/3 bg-secondary" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Heart aria-hidden="true" className="h-7 w-7 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Sign in and tap the heart on a product to save it here.
            </p>
            <Link href="/browse" className="mt-6">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <ShoppingBag className="mr-2 h-4 w-4" /> Browse products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="group relative">
                <Link href={`/product/${product.id}`} className="block">
                  <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                    {product.product_images?.[0]?.image_url ? (
                      <Image
                        src={product.product_images[0].image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Image unavailable</div>
                    )}
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-sm font-medium">{product.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">${Number(product.price).toFixed(2)}</p>
                </Link>
                <button
                  type="button"
                  onClick={() => void toggleWishlist(product.id)}
                  className="absolute right-3 top-3 rounded-full bg-white/95 p-2 text-foreground shadow-sm transition-colors hover:text-accent"
                  aria-label={`Remove ${product.name} from wishlist`}
                >
                  <Heart aria-hidden="true" className="h-4 w-4 fill-current text-accent" />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
