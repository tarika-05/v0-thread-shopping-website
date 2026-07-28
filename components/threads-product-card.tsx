'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

interface ThreadsProductCardProps {
  product: Product
}

export function ThreadsProductCard({ product }: ThreadsProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const discountedPrice = product.discount_percent > 0
    ? product.price * (1 - product.discount_percent / 100)
    : product.price

  const image = product.images?.[imageIndex]?.image_url || '/fashion/mens-shirt-navy.png'

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group cursor-pointer h-full">
        {/* Image Container */}
        <div className="relative mb-4 overflow-hidden bg-secondary aspect-square">
          {/* Image */}
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
            {/* Discount Badge */}
            {product.discount_percent > 0 && (
              <div className="bg-accent text-accent-foreground px-3 py-1 text-xs font-bold uppercase tracking-wide">
                -{product.discount_percent}%
              </div>
            )}

            {/* Stock Badge */}
            <div className="ml-auto bg-black/70 text-white px-2 py-1 text-xs uppercase tracking-wide">
              In Stock
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              setIsWishlisted(!isWishlisted)
            }}
            className="absolute bottom-3 right-3 p-2 bg-white hover:bg-gray-100 rounded-full transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            title="Add to Wishlist"
          >
            <Heart
              size={18}
              className={isWishlisted ? 'fill-accent text-accent' : 'text-foreground'}
            />
          </button>

          {/* Quick View Button */}
          <button
            onClick={(e) => e.preventDefault()}
            className="absolute bottom-3 left-3 p-2 bg-white hover:bg-gray-100 rounded-full transition-all duration-300 shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            title="Quick View"
          >
            <Eye size={18} className="text-foreground" />
          </button>

          {/* Color Swatches */}
          {product.images && product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault()
                    setImageIndex(idx)
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    idx === imageIndex ? 'border-black scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: img.color_code }}
                  title={img.color}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-2">
          {/* Category */}
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.round(product.rating)
                      ? 'text-accent'
                      : 'text-muted'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.review_count})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-lg font-bold text-foreground">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount_percent > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full mt-4 bg-foreground hover:bg-foreground/90 text-primary-foreground text-sm font-semibold py-2"
            onClick={(e) => e.preventDefault()}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
}
