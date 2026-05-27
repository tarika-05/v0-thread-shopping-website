'use client'

import React, { createContext, useContext, useState } from 'react'

export interface CartItem {
  productId: string
  productName: string
  color: string
  colorCode: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string) => void
  updateQuantity: (productId: string, color: string, quantity: number) => void
  clearCart: () => void
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) => i.productId === item.productId && i.color === item.color
      )
      if (existingItem) {
        return prevItems.map((i) =>
          i.productId === item.productId && i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prevItems, item]
    })
  }

  const removeItem = (productId: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (i) => !(i.productId === productId && i.color === color)
      )
    )
  }

  const updateQuantity = (productId: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, color)
      return
    }
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.productId === productId && i.color === color
          ? { ...i, quantity }
          : i
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
