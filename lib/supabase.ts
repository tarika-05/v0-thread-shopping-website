import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
        }
        Update: {
          email?: string
          full_name?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          stock: number
          created_at: string
        }
        Insert: {
          name: string
          description: string
          price: number
          stock: number
        }
        Update: {
          name?: string
          description?: string
          price?: number
          stock?: number
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          color: string
          color_code: string
          image_url: string
          order: number
        }
        Insert: {
          product_id: string
          color: string
          color_code: string
          image_url: string
          order: number
        }
        Update: {
          color?: string
          color_code?: string
          image_url?: string
          order?: number
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          color: string
          quantity: number
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          color: string
          quantity: number
        }
        Update: {
          quantity?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_price: number
          payment_method: string
          status: string
          created_at: string
        }
        Insert: {
          user_id: string
          total_price: number
          payment_method: string
          status: string
        }
        Update: {
          status?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          color: string
          quantity: number
          price: number
        }
        Insert: {
          order_id: string
          product_id: string
          color: string
          quantity: number
          price: number
        }
      }
    }
  }
}
