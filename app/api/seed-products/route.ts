import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const threadProducts = [
  {
    name: 'Premium Cotton Thread',
    description: 'High-quality 100% cotton thread, perfect for hand and machine sewing. Available in 24 vibrant colors.',
    price: 2.99,
    colors: [
      { color: 'Black', code: '#000000' },
      { color: 'White', code: '#FFFFFF' },
      { color: 'Navy Blue', code: '#000080' },
      { color: 'Red', code: '#FF0000' },
      { color: 'Deep Green', code: '#004225' },
      { color: 'Forest Green', code: '#228B22' },
      { color: 'Burgundy', code: '#800020' },
      { color: 'Gold', code: '#FFD700' },
    ],
  },
  {
    name: 'Silk Thread Deluxe',
    description: 'Luxurious silk thread with natural sheen. Ideal for embroidery and fine sewing projects.',
    price: 4.99,
    colors: [
      { color: 'Emerald', code: '#50C878' },
      { color: 'Sapphire Blue', code: '#0F52BA' },
      { color: 'Rose Pink', code: '#FF007F' },
      { color: 'Ivory', code: '#FFFFF0' },
      { color: 'Charcoal Gray', code: '#36454F' },
      { color: 'Plum', code: '#DDA0DD' },
      { color: 'Teal', code: '#008080' },
      { color: 'Copper', code: '#B87333' },
    ],
  },
  {
    name: 'Heavy Duty Polyester',
    description: 'Strong polyester thread for durable stitching. Great for upholstery and heavy fabrics.',
    price: 1.99,
    colors: [
      { color: 'Jet Black', code: '#0A0E27' },
      { color: 'Silver', code: '#C0C0C0' },
      { color: 'Brown', code: '#8B4513' },
      { color: 'Olive', code: '#808000' },
      { color: 'Steel Gray', code: '#70687E' },
      { color: 'Maroon', code: '#800000' },
      { color: 'Khaki', code: '#F0E68C' },
      { color: 'Coral', code: '#FF7F50' },
    ],
  },
  {
    name: 'Metallic Embroidery Thread',
    description: 'Shimmering metallic thread for special effects. Perfect for embroidery and decorative work.',
    price: 3.49,
    colors: [
      { color: 'Silver Metallic', code: '#E8E8E8' },
      { color: 'Gold Metallic', code: '#FFD700' },
      { color: 'Bronze', code: '#CD7F32' },
      { color: 'Rose Gold', code: '#B76E79' },
      { color: 'Copper Metallic', code: '#B87333' },
      { color: 'Pearl White', code: '#FDEEF4' },
      { color: 'Iridescent Blue', code: '#4B8BBE' },
      { color: 'Iridescent Purple', code: '#9370DB' },
    ],
  },
  {
    name: 'Nylon Thread Professional',
    description: 'Versatile nylon thread, strong and stretchy. Ideal for leather, vinyl, and canvas.',
    price: 2.49,
    colors: [
      { color: 'Black', code: '#000000' },
      { color: 'White', code: '#FFFFFF' },
      { color: 'Tan', code: '#D2B48C' },
      { color: 'Coffee Brown', code: '#6F4E37' },
      { color: 'Navy', code: '#001F3F' },
      { color: 'Royal Blue', code: '#4169E1' },
      { color: 'Crimson', code: '#DC143C' },
      { color: 'Lime Green', code: '#32CD32' },
    ],
  },
  {
    name: 'Rayon Lustrous Thread',
    description: 'Beautiful rayon thread with high sheen. Perfect for heirloom sewing and decorative stitching.',
    price: 3.99,
    colors: [
      { color: 'Pearl', code: '#F0F8FF' },
      { color: 'Sunset Orange', code: '#FD7E14' },
      { color: 'Fuchsia', code: '#FF1493' },
      { color: 'Lavender', code: '#E6E6FA' },
      { color: 'Turquoise', code: '#40E0D0' },
      { color: 'Mint Green', code: '#98FF98' },
      { color: 'Golden Yellow', code: '#FFD700' },
      { color: 'Deep Purple', code: '#440154' },
    ],
  },
  {
    name: 'Wool Thread Eco',
    description: 'Sustainable wool thread, warm and natural. Perfect for knitting and felting projects.',
    price: 2.79,
    colors: [
      { color: 'Natural Cream', code: '#FFFDD0' },
      { color: 'Charcoal', code: '#36454F' },
      { color: 'Forest Green', code: '#228B22' },
      { color: 'Rust Red', code: '#B7410E' },
      { color: 'Slate Blue', code: '#6A5ACD' },
      { color: 'Oatmeal', code: '#D2B48C' },
      { color: 'Dark Teal', code: '#003333' },
      { color: 'Mulberry', code: '#C54B8C' },
    ],
  },
  {
    name: 'Spun Polyester Variegated',
    description: 'Multi-colored variegated polyester thread. Creates beautiful effects in quilting and sewing.',
    price: 2.29,
    colors: [
      { color: 'Rainbow Mix', code: '#FF69B4' },
      { color: 'Pastel Mix', code: '#FFB6C1' },
      { color: 'Earth Tones', code: '#8B7355' },
      { color: 'Ocean Waves', code: '#00CED1' },
      { color: 'Sunset Blend', code: '#FF6347' },
      { color: 'Forest Mix', code: '#556B2F' },
      { color: 'Jewel Tones', code: '#4B0082' },
      { color: 'Autumn Colors', code: '#D2691E' },
    ],
  },
]

export async function POST() {
  try {
    // Check if products already exist
    const { data: existingProducts } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (existingProducts && existingProducts.length > 0) {
      return NextResponse.json({
        message: 'Products already seeded',
        skipped: true,
      })
    }

    // Insert products
    for (const product of threadProducts) {
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
        console.error('Product insert error:', productError)
        continue
      }

      // Insert product images (colors)
      const imagesData = product.colors.map((color, index) => ({
        product_id: productData.id,
        color: color.color,
        color_code: color.code,
        image_url: `/api/placeholder-thread?color=${encodeURIComponent(
          color.code
        )}&name=${encodeURIComponent(product.name)}`,
        order: index,
      }))

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imagesData)

      if (imagesError) {
        console.error('Images insert error:', imagesError)
      }
    }

    return NextResponse.json({
      message: 'Products seeded successfully',
      productCount: threadProducts.length,
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed products' },
      { status: 500 }
    )
  }
}
