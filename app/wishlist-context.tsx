'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
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
  const { session, loading: authLoading } = useAuth()
  const user = session?.user
  const [wishlist, setWishlist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadWishlist() {
      if (authLoading) return
      if (!user) {
        setWishlist([])
        setLoading(false)
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id)

      if (!active) return
      if (error) {
        console.error('Could not load wishlist:', error)
        setWishlist([])
      } else {
        setWishlist((data ?? []).map((item) => item.product_id))
      }
      setLoading(false)
    }

    void loadWishlist()
    return () => { active = false }
  }, [authLoading, user?.id])

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!user) return
    const wasSaved = wishlist.includes(productId)

    setWishlist((current) => wasSaved
      ? current.filter((id) => id !== productId)
      : [...current, productId])

    const result = wasSaved
      ? await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', productId)
      : await supabase.from('wishlist').upsert({ user_id: user.id, product_id: productId }, { onConflict: 'user_id,product_id' })

    if (result.error) {
      console.error('Could not update wishlist:', result.error)
      setWishlist((current) => wasSaved
        ? [...new Set([...current, productId])]
        : current.filter((id) => id !== productId))
      throw result.error
    }
  }, [user, wishlist])

  const isInWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist])

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) throw new Error('useWishlist must be used within a WishlistProvider')
  return context
}
