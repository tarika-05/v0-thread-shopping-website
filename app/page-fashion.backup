'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ThreadsHero } from '@/components/threads-hero'
import { FeaturedCollections } from '@/components/featured-collections'
import { ProductsGrid } from '@/components/products-grid'
import { ThreadsProductCard } from '@/components/threads-product-card'

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

  // Split products into sections
  const newArrivals = filteredProducts.slice(0, 4)
  const trendingProducts = filteredProducts.slice(4, 8)
  const bestSellers = filteredProducts.slice(8, 12)
  const saleProducts = filteredProducts.filter((p) => p.discount_percent > 0).slice(0, 4)

  // Check if we're on home or filtered view
  const isFilteredView = selectedCategory || searchQuery

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section - Only show on home */}
      {!isFilteredView && <ThreadsHero />}

      {/* Featured Collections - Only show on home */}
      {!isFilteredView && <FeaturedCollections />}

      {/* New Arrivals Section */}
      {!isFilteredView && (
        <ProductsGrid
          title="New Arrivals"
          description="Discover the latest additions to our collection"
          products={newArrivals}
          loading={loading}
        />
      )}

      {/* Filtered Products - Show when filtering */}
      {isFilteredView && (
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {selectedCategory
                  ? selectedCategory
                      .split('-')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                  : `Search Results for "${searchQuery}"`}
              </h1>
              <p className="text-muted-foreground text-lg">
                {loading
                  ? 'Loading products...'
                  : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-secondary rounded-lg overflow-hidden animate-pulse">
                    <div className="bg-muted aspect-square mb-4" />
                    <div className="p-4 space-y-3">
                      <div className="bg-muted rounded h-4 w-3/4" />
                      <div className="bg-muted rounded h-6 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="mb-4">
                  <div className="text-6xl mb-4">∅</div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery ? 'Try adjusting your search terms' : 'Check back soon for new arrivals'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ThreadsProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trending Section - Only show on home when not filtered */}
      {!isFilteredView && (
        <ProductsGrid
          title="Trending Now"
          description="Shop the most popular items this week"
          products={trendingProducts}
          loading={loading}
        />
      )}

      {/* Best Sellers Section - Only show on home */}
      {!isFilteredView && (
        <ProductsGrid
          title="Best Sellers"
          description="Customer favorites and top-rated picks"
          products={bestSellers}
          loading={loading}
        />
      )}

      {/* Sale Section - Only show on home when we have sale products */}
      {!isFilteredView && saleProducts.length > 0 && (
        <section className="py-16 sm:py-24 bg-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <p className="text-accent font-medium text-sm uppercase tracking-widest mb-3">Sale</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Exclusive Offers
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Limited time deals on selected items. Shop now before they&apos;re gone.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ThreadsProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Support Section */}
      <section className="py-12 sm:py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over $100 worldwide</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">30-day return policy, no questions asked</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Secure Shopping</h3>
              <p className="text-sm text-muted-foreground">SSL encrypted & trusted payment methods</p>
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
