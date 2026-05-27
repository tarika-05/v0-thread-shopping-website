import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const threadProducts = [
  {
    name: 'Premium Cotton Thread',
    description: 'High-quality 100% cotton thread, perfect for hand and machine sewing. 200m per spool. Available in 8 vibrant colors.',
    price: 2.99,
    colors: [
      { color: 'Black', code: '#000000', image: '/threads/black-thread.jpg' },
      { color: 'White', code: '#FFFFFF', image: '/threads/white-thread.jpg' },
      { color: 'Navy Blue', code: '#000080', image: '/threads/navy-blue-thread.jpg' },
      { color: 'Red', code: '#FF0000', image: '/threads/red-thread.jpg' },
      { color: 'Deep Green', code: '#004225', image: '/threads/green-thread.jpg' },
      { color: 'Emerald', code: '#50C878', image: '/threads/green-thread.jpg' },
      { color: 'Burgundy', code: '#800020', image: '/threads/red-thread.jpg' },
      { color: 'Gold', code: '#FFD700', image: '/threads/gold-thread.jpg' },
    ],
  },
  {
    name: 'Silk Thread Deluxe',
    description: 'Luxurious silk thread with natural sheen. Ideal for embroidery and fine sewing projects. 300m per spool.',
    price: 4.99,
    colors: [
      { color: 'Rose Pink', code: '#FF007F', image: '/threads/pink-thread.jpg' },
      { color: 'Ivory', code: '#FFFFF0', image: '/threads/white-thread.jpg' },
      { color: 'Sapphire Blue', code: '#0F52BA', image: '/threads/navy-blue-thread.jpg' },
      { color: 'Charcoal Gray', code: '#36454F', image: '/threads/black-thread.jpg' },
      { color: 'Plum', code: '#DDA0DD', image: '/threads/pink-thread.jpg' },
      { color: 'Teal', code: '#008080', image: '/threads/green-thread.jpg' },
      { color: 'Copper', code: '#B87333', image: '/threads/gold-thread.jpg' },
      { color: 'Cream', code: '#FFFDD0', image: '/threads/white-thread.jpg' },
    ],
  },
  {
    name: 'Heavy Duty Polyester',
    description: 'Strong polyester thread for durable stitching. Great for upholstery and heavy fabrics. 500m per spool.',
    price: 1.99,
    colors: [
      { color: 'Jet Black', code: '#0A0E27', image: '/threads/black-thread.jpg' },
      { color: 'Silver', code: '#C0C0C0', image: '/threads/white-thread.jpg' },
      { color: 'Brown', code: '#8B4513', image: '/threads/gold-thread.jpg' },
      { color: 'Steel Gray', code: '#70687E', image: '/threads/black-thread.jpg' },
      { color: 'Maroon', code: '#800000', image: '/threads/red-thread.jpg' },
      { color: 'Khaki', code: '#F0E68C', image: '/threads/gold-thread.jpg' },
      { color: 'Olive', code: '#808000', image: '/threads/green-thread.jpg' },
      { color: 'Coral', code: '#FF7F50', image: '/threads/red-thread.jpg' },
    ],
  },
  {
    name: 'Metallic Embroidery Thread',
    description: 'Shimmering metallic thread for special effects. Perfect for embroidery and decorative work. 250m per spool.',
    price: 3.49,
    colors: [
      { color: 'Gold Metallic', code: '#FFD700', image: '/threads/gold-thread.jpg' },
      { color: 'Silver Metallic', code: '#E8E8E8', image: '/threads/white-thread.jpg' },
      { color: 'Bronze', code: '#CD7F32', image: '/threads/gold-thread.jpg' },
      { color: 'Rose Gold', code: '#B76E79', image: '/threads/pink-thread.jpg' },
      { color: 'Copper', code: '#B87333', image: '/threads/gold-thread.jpg' },
      { color: 'Pearl White', code: '#FDEEF4', image: '/threads/white-thread.jpg' },
      { color: 'Iridescent Blue', code: '#4B8BBE', image: '/threads/navy-blue-thread.jpg' },
      { color: 'Iridescent Purple', code: '#9370DB', image: '/threads/pink-thread.jpg' },
    ],
  },
  {
    name: 'Nylon Thread Professional',
    description: 'Versatile nylon thread, strong and stretchy. Ideal for leather, vinyl, and canvas. 400m per spool.',
    price: 2.49,
    colors: [
      { color: 'Black', code: '#000000', image: '/threads/black-thread.jpg' },
      { color: 'White', code: '#FFFFFF', image: '/threads/white-thread.jpg' },
      { color: 'Tan', code: '#D2B48C', image: '/threads/gold-thread.jpg' },
      { color: 'Navy', code: '#001F3F', image: '/threads/navy-blue-thread.jpg' },
      { color: 'Royal Blue', code: '#4169E1', image: '/threads/navy-blue-thread.jpg' },
      { color: 'Crimson', code: '#DC143C', image: '/threads/red-thread.jpg' },
      { color: 'Lime Green', code: '#32CD32', image: '/threads/green-thread.jpg' },
      { color: 'Coffee Brown', code: '#6F4E37', image: '/threads/gold-thread.jpg' },
    ],
  },
  {
    name: 'Rayon Lustrous Thread',
    description: 'Beautiful rayon thread with high sheen. Perfect for heirloom sewing and decorative stitching. 300m per spool.',
    price: 3.99,
    colors: [
      { color: 'Sunset Orange', code: '#FD7E14', image: '/threads/red-thread.jpg' },
      { color: 'Fuchsia', code: '#FF1493', image: '/threads/pink-thread.jpg' },
      { color: 'Turquoise', code: '#40E0D0', image: '/threads/green-thread.jpg' },
      { color: 'Mint Green', code: '#98FF98', image: '/threads/green-thread.jpg' },
      { color: 'Lavender', code: '#E6E6FA', image: '/threads/pink-thread.jpg' },
      { color: 'Golden Yellow', code: '#FFD700', image: '/threads/gold-thread.jpg' },
      { color: 'Pearl', code: '#F0F8FF', image: '/threads/white-thread.jpg' },
      { color: 'Deep Purple', code: '#440154', image: '/threads/pink-thread.jpg' },
    ],
  },
  {
    name: 'Wool Thread Eco',
    description: 'Sustainable wool thread, warm and natural. Perfect for knitting and felting projects. 350m per spool.',
    price: 2.79,
    colors: [
      { color: 'Natural Cream', code: '#FFFDD0', image: '/threads/white-thread.jpg' },
      { color: 'Charcoal', code: '#36454F', image: '/threads/black-thread.jpg' },
      { color: 'Forest Green', code: '#228B22', image: '/threads/green-thread.jpg' },
      { color: 'Rust Red', code: '#B7410E', image: '/threads/red-thread.jpg' },
      { color: 'Slate Blue', code: '#6A5ACD', image: '/threads/navy-blue-thread.jpg' },
      { color: 'Oatmeal', code: '#D2B48C', image: '/threads/gold-thread.jpg' },
      { color: 'Dark Teal', code: '#003333', image: '/threads/green-thread.jpg' },
      { color: 'Mulberry', code: '#C54B8C', image: '/threads/pink-thread.jpg' },
    ],
  },
  {
    name: 'Spun Polyester Variegated',
    description: 'Multi-colored variegated polyester thread. Creates beautiful rainbow effects in quilting. 400m per spool.',
    price: 2.29,
    colors: [
      { color: 'Rainbow Mix', code: '#FF69B4', image: '/threads/multicolor-thread.jpg' },
      { color: 'Pastel Mix', code: '#FFB6C1', image: '/threads/pink-thread.jpg' },
      { color: 'Ocean Waves', code: '#00CED1', image: '/threads/green-thread.jpg' },
      { color: 'Sunset Blend', code: '#FF6347', image: '/threads/red-thread.jpg' },
      { color: 'Forest Mix', code: '#556B2F', image: '/threads/green-thread.jpg' },
      { color: 'Jewel Tones', code: '#4B0082', image: '/threads/navy-blue-thread.jpg' },
      { color: 'Autumn Colors', code: '#D2691E', image: '/threads/gold-thread.jpg' },
      { color: 'Earth Tones', code: '#8B7355', image: '/threads/gold-thread.jpg' },
    ],
  },
]

export async function POST() {
  try {
    // Check if products already exist
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (!checkError && existingProducts && existingProducts.length > 0) {
      console.log('[v0] Products already seeded, skipping')
      return NextResponse.json({
        message: 'Products already seeded',
        skipped: true,
      })
    }

    console.log('[v0] Starting to seed products...')
    let successCount = 0
    let errorCount = 0

    // Insert products
    for (const product of threadProducts) {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .insert({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: 500,
          })
          .select('id')
          .single()

        if (productError) {
          console.error(`[v0] Error inserting product "${product.name}":`, productError)
          errorCount++
          continue
        }

        if (!productData) {
          console.error(`[v0] No product data returned for "${product.name}"`)
          errorCount++
          continue
        }

        // Insert product images (colors)
        const imagesData = product.colors.map((color, index) => ({
          product_id: productData.id,
          color: color.color,
          color_code: color.code,
          image_url: color.image,
          order: index,
        }))

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imagesData)

        if (imagesError) {
          console.error(
            `[v0] Error inserting images for "${product.name}":`,
            imagesError
          )
          errorCount++
        } else {
          console.log(`[v0] Successfully seeded: ${product.name}`)
          successCount++
        }
      } catch (err) {
        console.error(`[v0] Exception while seeding "${product.name}":`, err)
        errorCount++
      }
    }

    console.log(
      `[v0] Seeding complete: ${successCount} succeeded, ${errorCount} failed`
    )
    return NextResponse.json({
      message: 'Products seeded successfully',
      productCount: successCount,
      errorCount: errorCount,
    })
  } catch (error) {
    console.error('[v0] Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed products', details: String(error) },
      { status: 500 }
    )
  }
}
