'use client'

import Link from 'next/link'
import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface ThreadHubProductCardProps {
  id: string
  name: string
  sku: string
  price: number
  image: string
  material: string
  moq: number
  stock: number
  category: string
  yarnCategory: string
  tensileStrength?: number
  weight?: number
}

export function ThreadHubProductCard({
  id,
  name,
  sku,
  price,
  image,
  material,
  moq,
  stock,
  category,
  yarnCategory,
  tensileStrength,
  weight,
}: ThreadHubProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const isInStock = stock > 0

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-all hover:shadow-lg group cursor-pointer">
        {/* Image Container */}
        <div className="relative aspect-square bg-secondary overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Stock Badge */}
          <div className="absolute top-3 left-3">
            {isInStock ? (
              <span className="bg-green-500/90 text-white text-xs font-semibold px-2 py-1 rounded">
                In Stock ({stock})
              </span>
            ) : (
              <span className="bg-red-500/90 text-white text-xs font-semibold px-2 py-1 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
          >
            <Heart
              size={18}
              className={isWishlisted ? 'fill-accent text-accent' : 'text-foreground'}
            />
          </button>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded">
              {yarnCategory}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* SKU */}
          <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">SKU: {sku}</p>

          {/* Name */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm group-hover:text-accent transition-colors">
            {name}
          </h3>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-foreground/70">
            {material && (
              <div>
                <p className="text-muted-foreground text-xs">Material</p>
                <p className="font-medium">{material}</p>
              </div>
            )}
            {weight && (
              <div>
                <p className="text-muted-foreground text-xs">Weight</p>
                <p className="font-medium">{weight}g</p>
              </div>
            )}
            {tensileStrength && (
              <div>
                <p className="text-muted-foreground text-xs">Tensile</p>
                <p className="font-medium">{tensileStrength} MPa</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-xs">MOQ</p>
              <p className="font-medium">{moq} units</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-3 pb-3 border-t border-border">
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-lg font-bold text-accent">${price.toFixed(2)}</span>
              <span className="text-xs text-muted-foreground">per unit</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Bulk pricing available for 100+ units
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              className="flex-1 h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              <ShoppingCart size={14} className="mr-1" />
              Inquire
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-8 text-xs"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              Details
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
