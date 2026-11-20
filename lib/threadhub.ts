import { supabase } from '@/lib/supabase'

export const yarnCategories = [
  { label: 'Acrylic Yarn', value: 'acrylic', image: '/yarns/acrylic-gallery.png' },
  { label: 'Blended Yarn', value: 'blended', image: '/yarns/blended-gallery.png' },
  { label: 'Cotton Yarn', value: 'cotton', image: '/yarns/cotton-gallery.png' },
  { label: 'Embroidery Thread', value: 'embroidery', image: '/yarns/embroidery-gallery.png' },
  { label: 'Linen Yarn', value: 'linen', image: '/yarns/linen-gallery.png' },
  { label: 'Nylon Yarn', value: 'nylon', image: '/yarns/nylon-gallery.png' },
  { label: 'Polyester Yarn', value: 'polyester', image: '/yarns/polyester-gallery.png' },
  { label: 'Silk Yarn', value: 'silk', image: '/yarns/silk-gallery.png' },
  { label: 'Spandex Yarn', value: 'spandex', image: '/yarns/spandex-gallery.png' },
  { label: 'Technical Yarn', value: 'technical', image: '/yarns/technical-gallery.png' },
  { label: 'Wool Yarn', value: 'wool', image: '/yarns/wool-gallery.png' },
] as const

export type BulkPriceTier = {
  quantity: number
  unit_price: number
  discount: number
}

export type ProductImage = {
  color: string
  color_code: string
  image_url: string
  order: number
}

export type ThreadHubProduct = {
  id: string
  sku: string | null
  name: string
  description: string | null
  price: number
  stock: number
  category: string | null
  material: string | null
  material_type: string | null
  moq: number | null
  weight_grams: number | null
  thickness_mm: number | null
  tensile_strength: string | null
  tensile_strength_mpa: number | null
  cone_size: string | null
  bulk_pricing: BulkPriceTier[] | null
  rating: number | null
  review_count: number | null
  product_images: ProductImage[] | null
}

export async function fetchThreadHubProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name, description, price, stock, category, material, material_type, moq, weight_grams, thickness_mm, tensile_strength, tensile_strength_mpa, cone_size, bulk_pricing, rating, review_count, product_images(color, color_code, image_url, order)')
    .order('name')

  if (error) throw error

  return ((data ?? []) as unknown as ThreadHubProduct[]).map((product) => ({
    ...product,
    price: Number(product.price),
    stock: Number(product.stock ?? 0),
    moq: Number(product.moq ?? 1),
    weight_grams: product.weight_grams === null ? null : Number(product.weight_grams),
    thickness_mm: product.thickness_mm === null ? null : Number(product.thickness_mm),
    product_images: [...(product.product_images ?? [])].sort((a, b) => a.order - b.order),
    bulk_pricing: Array.isArray(product.bulk_pricing) ? product.bulk_pricing : [],
  }))
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export function galleryPanelStyle(imageUrl: string, index = 0) {
  const positions = ['0% 0%', '100% 0%', '0% 100%', '100% 100%']
  const isGallerySheet = imageUrl.includes('-gallery.png')

  return isGallerySheet
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: positions[index % positions.length],
        backgroundSize: '200% 200%',
        backgroundRepeat: 'no-repeat',
      }
    : {
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }
}
