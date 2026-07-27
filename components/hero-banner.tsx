'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export function HeroBanner() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-r from-primary/90 to-primary overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/fashion/hero-banner.png"
          alt="Hero Banner"
          fill
          className="object-cover opacity-40"
          priority
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-start">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {/* Overline */}
            <p className="text-accent font-semibold text-sm md:text-base tracking-wider mb-4">
              EXCLUSIVE COLLECTION
            </p>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Premium Fashion
              <span className="block text-accent">for Modern Life</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
              Discover our curated selection of luxury clothing and timeless pieces designed for those who appreciate quality and style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/?sort=new">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
                >
                  Shop New Collection
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/?category=mens">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Explore Men&apos;s
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
    </div>
  )
}
