'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: Array<{ color: string; color_code: string; image_url: string }>
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeAndFetch = async () => {
      try {
        // Initialize database tables first
        console.log('[v0] Initializing database tables...')
        const initResponse = await fetch('/api/init-db', { method: 'POST' })
        console.log('[v0] Init response:', initResponse.status)

        // Wait a moment for tables to be created
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Try to seed products if needed
        console.log('[v0] Seeding products...')
        const seedResponse = await fetch('/api/seed-products', { method: 'POST' })
        const seedData = await seedResponse.json()
        console.log('[v0] Seed response:', seedData)
        setIsInitialized(true)

        // Wait a moment for products to be inserted
        await new Promise(resolve => setTimeout(resolve, 500))

        // Fetch products
        console.log('[v0] Fetching products from database...')
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            price,
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
          console.log('[v0] Fetched products:', data?.length || 0)
          const productsWithImages = data?.map((product: any) => ({
            ...product,
            images: product.product_images?.sort(
              (a: any, b: any) => a.order - b.order
            ),
          })) || []
          setProducts(productsWithImages)
        }
      } catch (error) {
        console.error('[v0] Initialization error:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAndFetch()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-accent/10 to-transparent py-12 px-4 sm:py-16 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Premium Threads
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Discover our curated collection of high-quality threads in every color imaginable. Perfect for sewing, embroidery, and crafting projects.
          </p>
          <Button className="bg-accent hover:bg-accent/90 text-white">
            Explore Now
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Our Collections
          </h2>
          <p className="text-muted-foreground">
            {loading
              ? 'Loading products...'
              : `Browse our ${products.length} thread collections`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="bg-muted rounded-lg h-64 mb-4"></div>
                  <div className="bg-muted rounded h-6 w-3/4 mb-2"></div>
                  <div className="bg-muted rounded h-4 w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products available yet. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const firstImage = product.images?.[0]
              return (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      {/* Product Image */}
                      <div className="bg-muted rounded-lg h-64 mb-4 flex items-center justify-center overflow-hidden">
                        {firstImage?.image_url ? (
                          <img
                            src={firstImage.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Color Swatches */}
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {product.images?.slice(0, 4).map((img, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-border"
                            style={{ backgroundColor: img.color_code }}
                            title={img.color}
                          ></div>
                        ))}
                        {product.images && product.images.length > 4 && (
                          <div className="w-6 h-6 rounded-full border-2 border-border bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            +{product.images.length - 4}
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button
                          size="sm"
                          className="bg-accent hover:bg-accent/90 text-white"
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-secondary/50 py-12 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Why Choose ThreadShop?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                Premium Quality
              </h3>
              <p className="text-muted-foreground">
                All our threads are sourced from trusted manufacturers worldwide.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">24/7</div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                Support Available
              </h3>
              <p className="text-muted-foreground">
                Our team is ready to help you find the perfect thread for your project.
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">Fast</div>
              <h3 className="font-bold text-lg text-foreground mb-2">
                Quick Shipping
              </h3>
              <p className="text-muted-foreground">
                Get your threads delivered quickly and safely to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
