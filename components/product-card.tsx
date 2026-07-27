'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useWishlist } from '@/app/wishlist-context'
import { useCart } from '@/app/cart-context'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  rating: number
  reviewCount: number
  discount?: number
  category?: string
}

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  reviewCount,
  discount = 0,
  category,
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)

  const discountedPrice = discount ? price * (1 - discount / 100) : price
  const formattedPrice = discountedPrice.toFixed(2)
  const formattedOriginal = price.toFixed(2)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(id)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(id, 1, name)
  }

  return (
    <Link href={`/product/${id}`}>
      <div
        className="group relative bg-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative w-full aspect-square bg-secondary overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200 shadow-md"
            title="Add to wishlist"
          >
            <Heart
              size={20}
              className={`transition-colors ${
                isInWishlist(id) ? 'fill-red-500 text-red-500' : 'text-foreground'
              }`}
            />
          </button>

          {/* Quick Add Button */}
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-4 transition-all duration-300">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="bg-white text-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-2 w-4/5"
              >
                <ShoppingBag size={18} />
                Quick Add
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          {/* Category */}
          {category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {category}
            </p>
          )}

          {/* Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < Math.floor(rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              ({reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              ${formattedPrice}
            </span>
            {discount > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                ${formattedOriginal}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
