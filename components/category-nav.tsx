'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronDown } from 'lucide-react'

interface Category {
  name: string
  slug: string
}

const categories: Category[] = [
  { name: "Men's Clothing", slug: 'mens' },
  { name: "Women's Clothing", slug: 'womens' },
  { name: 'Hoodies', slug: 'hoodies' },
  { name: 'Oversized T-Shirts', slug: 'oversized-tshirts' },
  { name: 'Sweatshirts', slug: 'sweatshirts' },
]

export function CategoryNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const activeCategory = categories.find((cat) => cat.slug === currentCategory)

  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="hidden md:flex items-center justify-start gap-8 py-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/?category=${category.slug}`}
              className={`text-sm font-medium transition-colors py-2 border-b-2 ${
                currentCategory === category.slug
                  ? 'border-accent text-accent'
                  : 'border-transparent text-foreground hover:text-accent'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="md:hidden py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full text-foreground hover:text-accent transition-colors"
          >
            <span className="font-medium">
              {activeCategory ? activeCategory.name : 'All Categories'}
            </span>
            <ChevronDown
              size={20}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 top-full bg-card border-b border-border shadow-lg z-50">
              <div className="flex flex-col">
                <Link
                  href="/"
                  className="px-4 py-3 text-foreground hover:bg-secondary transition-colors border-b border-border"
                  onClick={() => setIsOpen(false)}
                >
                  All Products
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/?category=${category.slug}`}
                    className={`px-4 py-3 transition-colors border-b border-border ${
                      currentCategory === category.slug
                        ? 'bg-secondary text-accent font-medium'
                        : 'text-foreground hover:bg-secondary'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
