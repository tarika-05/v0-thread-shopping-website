'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/cart-context'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, LogOut, User, Search, Menu, X, Heart } from 'lucide-react'

const categories = [
  { name: "Men's", slug: 'mens' },
  { name: "Women's", slug: 'womens' },
  { name: 'Oversized', slug: 'oversized' },
  { name: 'Hoodies', slug: 'hoodies' },
  { name: 'Sweatshirts', slug: 'sweatshirts' },
  { name: 'Jeans', slug: 'jeans' },
  { name: 'Accessories', slug: 'accessories' },
]

export function Navbar() {
  const { items } = useCart()
  const { session, signOut } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setIsMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-2xl font-bold text-foreground tracking-tight">
              THREADS
            </span>
          </Link>

          {/* Desktop Categories */}
          <div className="hidden lg:flex items-center gap-8">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/?category=${cat.slug}`}
                className="text-sm font-medium text-foreground hover:text-accent transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const isMobileSearch = document.getElementById('mobile-search')
                if (isMobileSearch) {
                  isMobileSearch.focus()
                }
              }}
              className="md:hidden"
              title="Search"
            >
              <Search size={20} />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist" className="hidden sm:block">
              <Button variant="ghost" size="icon" title="Wishlist">
                <Heart size={20} />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" title="Shopping Cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Account */}
            {session ? (
              <>
                <Link href="/account" className="hidden sm:block">
                  <Button variant="ghost" size="icon" title="Account">
                    <User size={20} />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="hidden sm:flex"
                >
                  <LogOut size={20} />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm border-border hover:bg-secondary"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button size="sm" className="text-xs sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4 border-t border-border">
          <form onSubmit={handleSearch} className="relative">
            <input
              id="mobile-search"
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-secondary border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/?category=${cat.slug}`}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <div className="border-t border-border pt-2 space-y-2">
              <Link href="/wishlist" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Heart size={16} className="mr-2" />
                  Wishlist
                </Button>
              </Link>
              {session ? (
                <>
                  <Link href="/account" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start" size="sm">
                      <User size={16} className="mr-2" />
                      My Account
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    className="w-full justify-start"
                    size="sm"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
