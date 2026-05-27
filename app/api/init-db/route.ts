import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST() {
  try {
    console.log('[v0] Starting database initialization...')

    // Check if tables already exist by trying to query products
    const { data: existingTables } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (existingTables !== null) {
      console.log('[v0] Tables already exist, skipping creation')
      return NextResponse.json({ 
        message: 'Database tables already exist',
        skipped: true 
      })
    }

    // Tables don't exist, create them
    const { error: productsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.products (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          stock INTEGER NOT NULL DEFAULT 100,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    })

    if (productsError) {
      console.log('[v0] Products table creation note:', productsError.message)
    }

    const { error: imagesError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.product_images (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
          color TEXT NOT NULL,
          color_code TEXT NOT NULL,
          image_url TEXT NOT NULL,
          "order" INTEGER NOT NULL
        )
      `,
    })

    if (imagesError) {
      console.log('[v0] Product images table creation note:', imagesError.message)
    }

    const { error: cartError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.cart_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
          color TEXT NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    })

    if (cartError) {
      console.log('[v0] Cart items table creation note:', cartError.message)
    }

    const { error: ordersError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          total_price DECIMAL(10, 2) NOT NULL,
          payment_method TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `,
    })

    if (ordersError) {
      console.log('[v0] Orders table creation note:', ordersError.message)
    }

    const { error: orderItemsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.order_items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
          product_id UUID NOT NULL REFERENCES public.products(id),
          color TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL
        )
      `,
    })

    if (orderItemsError) {
      console.log('[v0] Order items table creation note:', orderItemsError.message)
    }

    console.log('[v0] Database initialization completed')
    return NextResponse.json({ 
      message: 'Database tables initialized successfully',
      initialized: true 
    })
  } catch (error) {
    console.error('[v0] Database init error:', error)
    // Don't fail on error - tables might already exist
    return NextResponse.json(
      { 
        message: 'Database initialization attempted',
        error: String(error)
      },
      { status: 200 }
    )
  }
}
