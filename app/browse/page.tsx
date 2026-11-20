'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/product-card'

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  rating: number | null
  review_count: number | null
  discount_percent: number | null
  product_images: { image_url: string; order: number }[] | null
}

function BrowseProducts() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true

    async function loadProducts() {
      setLoading(true)
      setFailed(false)
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, category, rating, review_count, discount_percent, product_images(image_url, order)')
        .order('created_at', { ascending: false })

      if (!active) return
      if (error) {
        console.error('Failed to load browse products:', error)
        setFailed(true)
        setProducts([])
      } else {
        setProducts((data ?? []) as Product[])
      }
      setLoading(false)
    }

    loadProducts()
    return () => {
      active = false
    }
  }, [])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = !category || product.category?.toLowerCase() === category.toLowerCase()
      const matchesSearch = !search || `${product.name} ${product.description ?? ''} ${product.category ?? ''}`.toLowerCase().includes(search)
      return matchesCategory && matchesSearch
    })
  }, [products, category, search])

  const title = category
    ? `${category.charAt(0).toUpperCase()}${category.slice(1)} yarns`
    : search
      ? `Search results for “${searchParams.get('search')}”`
      : 'Browse all yarns'

  return (
    <main className="min-h-[60vh] bg-background">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">ThreadHub marketplace</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {loading ? 'Loading products…' : `${filteredProducts.length} product${filteredProducts.length === 1 ? '' : 's'}`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4" aria-label="Loading products">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-secondary" />
                <div className="mt-3 h-4 w-3/4 bg-secondary" />
                <div className="mt-2 h-4 w-1/3 bg-secondary" />
              </div>
            ))}
          </div>
        ) : failed ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">Products are temporarily unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">Please try again in a moment.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">No yarns found</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try another category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => {
              const image = [...(product.product_images ?? [])]
                .sort((a, b) => a.order - b.order)[0]?.image_url ?? '/yarns/acrylic-cone-1.png'
              return (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={Number(product.price)}
                  image={image}
                  rating={Number(product.rating ?? 0)}
                  reviewCount={Number(product.review_count ?? 0)}
                  discount={Number(product.discount_percent ?? 0)}
                  category={product.category ?? undefined}
                />
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<main className="min-h-[60vh] animate-pulse bg-background" />}>
      <BrowseProducts />
    </Suspense>
  )
}
