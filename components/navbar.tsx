'use client'

import Link from 'next/link'
import { useCart } from '@/app/cart-context'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { ShoppingCart, LogOut, User } from 'lucide-react'

export function Navbar() {
  const { items } = useCart()
  const { session, signOut } = useAuth()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-serif text-2xl font-bold text-foreground">
            ThreadShop
          </span>
        </Link>

        {/* Center - Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-foreground hover:text-accent transition-colors"
          >
            Shop
          </Link>
          {session && (
            <Link
              href="/account"
              className="text-foreground hover:text-accent transition-colors"
            >
              My Account
            </Link>
          )}
        </div>

        {/* Right - Auth & Cart */}
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
          </Link>

          {session ? (
            <>
              <Link href="/account">
                <Button variant="ghost" size="icon">
                  <User className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-accent hover:bg-accent/90 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
