'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { HeroBanner } from '@/components/hero-banner'
import { CategoryNav } from '@/components/category-nav'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  rating: number
  review_count: number
  discount_percent: number
  images: Array<{ color: string; color_code: string; image_url: string }>
}

function HomePageContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  const selectedCategory = searchParams.get('category')
  const searchQuery = searchParams.get('search')
  const sortBy = searchParams.get('sort') || 'featured'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            price,
            category,
            rating,
            review_count,
            discount_percent,
            product_images (
              color,
              color_code,
              image_url,
              order
            )
          `)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[v0] Products fetch error:', error)
          setProducts([])
        } else {
          const productsWithImages = data?.map((product: any) => ({
            ...product,
            images: product.product_images?.sort(
              (a: any, b: any) => a.order - b.order
            ),
          })) || []
          setProducts(productsWithImages)
        }
      } catch (error) {
        console.error('[v0] Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      )
    }

    // Sort
    if (sortBy === 'new') {
      filtered.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())
    } else if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(filtered)
  }, [products, selectedCategory, searchQuery, sortBy])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Category Navigation */}
      <CategoryNav />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header with Sort Options */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {selectedCategory
                ? selectedCategory
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                : searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'Discover Our Collection'}
            </h2>
            <p className="text-muted-foreground">
              {loading
                ? 'Loading products...'
                : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {/* Sort Options */}
          <div className="mt-4 sm:mt-0">
            <select
              defaultValue={sortBy}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('sort', e.target.value)
                window.history.replaceState(null, '', `?${params.toString()}`)
              }}
              className="px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden animate-pulse">
                <div className="bg-secondary aspect-square mb-4"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-muted rounded h-4 w-3/4"></div>
                  <div className="bg-muted rounded h-6 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Check back soon for new arrivals'}
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-white">
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.images?.[0]?.image_url || '/fashion/mens-shirt-navy.png'}
                rating={product.rating || 4.5}
                reviewCount={product.review_count || 0}
                discount={product.discount_percent || 0}
                category={product.category}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trust Section */}
      <section className="bg-secondary/50 mt-16 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why Shop With LUXE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-semibold text-foreground mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Free shipping on orders over $100
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">✓</div>
              <h3 className="font-semibold text-foreground mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                Curated selection of luxury items
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">↩️</div>
              <h3 className="font-semibold text-foreground mb-2">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day return policy, no questions asked
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-semibold text-foreground mb-2">Secure Checkout</h3>
              <p className="text-sm text-muted-foreground">
                SSL encrypted & trusted payment methods
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomePageContent />
    </Suspense>
  )
}
