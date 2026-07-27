'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-context'
import { supabase } from '@/lib/supabase'

interface WishlistContextType {
  wishlist: string[]
  toggleWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Load wishlist from database
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        setWishlist([])
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', user.id)

        if (error) {
          console.error('[v0] Error loading wishlist:', error)
          setWishlist([])
        } else {
          setWishlist(data?.map((item: any) => item.product_id) || [])
        }
      } catch (error) {
        console.error('[v0] Wishlist error:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWishlist()
  }, [user])

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      return
    }

    try {
      const isInWishlist = wishlist.includes(productId)

      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        if (error) throw error
        setWishlist(wishlist.filter((id) => id !== productId))
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist')
          .insert({
            user_id: user.id,
            product_id: productId,
          })

        if (error) throw error
        setWishlist([...wishlist, productId])
      }
    } catch (error) {
      console.error('[v0] Error toggling wishlist:', error)
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId)
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist, loading }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
