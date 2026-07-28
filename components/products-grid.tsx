'use client'

import Link from 'next/link'
import { ThreadsProductCard } from './threads-product-card'

interface Product {
  id: string
  name: string
  price: number
  rating: number
  review_count: number
  discount_percent: number
  category: string
  images: Array<{
    color: string
    color_code: string
    image_url: string
  }>
}

interface ProductsGridProps {
  title: string
  description?: string
  products: Product[]
  loading?: boolean
}

export function ProductsGrid({ title, description, products, loading = false }: ProductsGridProps) {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-accent font-medium text-sm uppercase tracking-widest mb-3">
            Featured
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-secondary rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">∅</div>
            <p className="text-muted-foreground text-lg">No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ThreadsProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
