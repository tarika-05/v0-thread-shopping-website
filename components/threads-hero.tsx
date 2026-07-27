import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function ThreadsHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background with gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50"
        style={{
          backgroundImage: "url('/fashion/hero-banner.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          backgroundBlend: 'overlay',
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-start justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Eyebrow Text */}
          <p className="text-accent font-medium text-sm uppercase tracking-widest mb-6">
            New Collection Available
          </p>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Timeless Fashion
            <br />
            <span className="text-accent">Redefined</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed">
            Discover our curated collection of premium clothing. Quality, style, and sustainability in every piece.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/?featured=true">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base font-semibold">
                Shop New Collection
              </Button>
            </Link>
            <Link href="/?sale=true">
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-base font-semibold"
              >
                View Sale
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="text-white text-xs uppercase tracking-widest mb-2">Scroll</div>
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
