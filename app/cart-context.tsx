'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { supabase } from '@/lib/supabase'

export interface CartItem {
  productId: string
  productName: string
  color: string
  colorCode: string
  price: number
  quantity: number
  image: string
  imageOrder?: number
  moq?: number
  stock?: number
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string) => void
  updateQuantity: (productId: string, color: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const userId = session?.user.id

    async function loadCart() {
      if (authLoading) return
      if (!userId) {
        if (active) {
          setItems([])
          setLoading(false)
        }
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, color, color_code, image_url, image_order, quantity, products(id, name, price, stock, moq)')
        .eq('user_id', userId)

      if (active) {
        if (error) {
          console.error('Could not load saved cart:', error)
          setItems([])
        } else {
          setItems((data ?? []).flatMap((row: any) => {
            const product = Array.isArray(row.products) ? row.products[0] : row.products
            if (!product) return []
            return [{
              productId: row.product_id,
              productName: product.name,
              color: row.color,
              colorCode: row.color_code ?? '',
              price: Number(product.price),
              quantity: Number(row.quantity),
              image: row.image_url ?? '',
              imageOrder: Number(row.image_order ?? 0),
              moq: Number(product.moq ?? 1),
              stock: Number(product.stock ?? 0),
            }]
          }))
        }
        setLoading(false)
      }
    }

    void loadCart()
    return () => { active = false }
  }, [authLoading, session?.user.id])

  const persistItem = useCallback(async (item: CartItem, quantity: number) => {
    const userId = session?.user.id
    if (!userId) return
    const { error } = await supabase.from('cart_items').upsert({
      user_id: userId,
      product_id: item.productId,
      color: item.color,
      color_code: item.colorCode,
      image_url: item.image,
      image_order: item.imageOrder ?? 0,
      quantity,
    }, { onConflict: 'user_id,product_id,color' })
    if (error) console.error('Could not save cart item:', error)
  }, [session?.user.id])

  const addItem = (item: CartItem) => {
    const existing = items.find((current) => current.productId === item.productId && current.color === item.color)
    const quantity = (existing?.quantity ?? 0) + item.quantity
    setItems((current) => {
      const found = current.some((entry) => entry.productId === item.productId && entry.color === item.color)
      return found
        ? current.map((entry) => entry.productId === item.productId && entry.color === item.color ? { ...entry, ...item, quantity } : entry)
        : [...current, { ...item, quantity }]
    })
    void persistItem(item, quantity)
  }

  const removeItem = (productId: string, color: string) => {
    setItems((current) => current.filter((item) => !(item.productId === productId && item.color === color)))
    if (session?.user.id) {
      void supabase.from('cart_items').delete().eq('user_id', session.user.id).eq('product_id', productId).eq('color', color)
    }
  }

  const updateQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) return removeItem(productId, color)
    const item = items.find((entry) => entry.productId === productId && entry.color === color)
    if (item && item.stock !== undefined) quantity = Math.min(quantity, item.stock)
    setItems((current) => current.map((entry) => entry.productId === productId && entry.color === color ? { ...entry, quantity } : entry))
    if (item) void persistItem(item, quantity)
  }

  const clearCart = () => {
    setItems([])
    if (session?.user.id) void supabase.from('cart_items').delete().eq('user_id', session.user.id)
  }

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])

  return <CartContext.Provider value={{ items, loading, addItem, removeItem, updateQuantity, clearCart, total }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) throw new Error('useCart must be used within CartProvider')
  return context
}
