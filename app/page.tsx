'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react'

const categoryHighlights = [
  {
    name: 'Acrylic Yarns',
    slug: 'acrylic',
    image: '/yarns/acrylic-cone-1.png',
    description: 'Durable & versatile',
  },
  {
    name: 'Cotton Yarns',
    slug: 'cotton',
    image: '/yarns/cotton-cone-1.png',
    description: 'Natural & premium',
  },
  {
    name: 'Wool Yarns',
    slug: 'wool',
    image: '/yarns/wool-cone-1.png',
    description: 'Luxury fibers',
  },
  {
    name: 'Blended Yarns',
    slug: 'blended',
    image: '/yarns/blended-cone-1.png',
    description: 'Optimal properties',
  },
]

export default function HomePage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary via-primary to-blue-900 text-white py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-4">
              B2B Textile Marketplace
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium Yarns & Textiles
            </h1>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Connect with verified suppliers. Access competitive bulk pricing, technical specifications,
              and reliable fulfillment for your textile sourcing needs.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/browse">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-3">
                  Browse Products <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3"
              >
                Become a Supplier
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="py-16 sm:py-24 bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Featured Categories</h2>
            <p className="text-muted-foreground text-lg">Browse our most popular yarn selections</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryHighlights.map((cat) => (
              <Link key={cat.slug} href={`/browse?category=${cat.slug}`}>
                <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent hover:shadow-lg transition-all group cursor-pointer">
                  {/* Image */}
                  <div className="aspect-square bg-secondary overflow-hidden">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent/10">
                  <Zap className="text-accent" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Competitive Pricing</h3>
                <p className="text-muted-foreground text-sm">
                  Tiered bulk pricing with discounts for larger orders. Transparent pricing with no hidden fees.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent/10">
                  <Shield className="text-accent" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Verified Suppliers</h3>
                <p className="text-muted-foreground text-sm">
                  All suppliers are verified for quality and reliability. Secure B2B transactions with full traceability.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-accent/10">
                  <Truck className="text-accent" size={24} />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Global Logistics</h3>
                <p className="text-muted-foreground text-sm">
                  Fast shipping worldwide. Real-time tracking and reliable delivery to your facility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Source Yarns?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of textile manufacturers and retailers sourcing through ThreadHub.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/browse">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-3">
                Start Shopping
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold px-8 py-3"
            >
              Request Quote
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
