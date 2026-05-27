'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/app/cart-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart as ShoppingCartIcon, Plus, Minus } from 'lucide-react'

interface ProductImage {
  color: string
  color_code: string
  image_url: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  product_images: ProductImage[]
}

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState<ProductImage | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            price,
            stock,
            product_images (
              color,
              color_code,
              image_url,
              order
            )
          `)
          .eq('id', productId)
          .single()

        if (error) {
          console.error('[v0] Product fetch error:', error)
        } else {
          const productWithImages = {
            ...data,
            product_images: data.product_images?.sort(
              (a: any, b: any) => a.order - b.order
            ),
          }
          setProduct(productWithImages)
          if (productWithImages.product_images?.length > 0) {
            setSelectedColor(productWithImages.product_images[0])
          }
        }
      } catch (error) {
        console.error('[v0] Fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleAddToCart = () => {
    if (!product || !selectedColor) return

    addItem({
      productId: product.id,
      productName: product.name,
      color: selectedColor.color,
      colorCode: selectedColor.color_code,
      price: product.price,
      quantity,
      image: selectedColor.image_url,
    })

    // Reset quantity
    setQuantity(1)
    // Show success message
    alert(`Added ${quantity} ${product.name}(s) in ${selectedColor.color} to cart!`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Product not found
          </h1>
          <Link href="/">
            <Button className="bg-accent hover:bg-accent/90 text-white">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex mb-8">
          <Button variant="outline">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Shop
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card>
              <CardContent className="p-6">
                <div className="bg-muted rounded-lg h-96 flex items-center justify-center overflow-hidden">
                  {selectedColor?.image_url ? (
                    <img
                      src={selectedColor.image_url}
                      alt={selectedColor.color}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground">No image</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Color Thumbnails */}
            {product.product_images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.product_images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(img)}
                    className={`rounded-lg overflow-hidden border-2 transition-all h-24 flex items-center justify-center ${
                      selectedColor?.color === img.color
                        ? 'border-accent'
                        : 'border-border hover:border-accent/50'
                    }`}
                  >
                    {img.image_url ? (
                      <img
                        src={img.image_url}
                        alt={img.color}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-muted-foreground text-center px-2">
                        {img.color}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <p className="text-muted-foreground text-lg">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-accent">
              ${product.price.toFixed(2)}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock > 10
                    ? 'bg-green-100 text-green-800'
                    : product.stock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-bold text-foreground mb-3">
                Select Color
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {product.product_images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(img)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:border-accent"
                    style={{
                      borderColor:
                        selectedColor?.color === img.color ? '#c87137' : '#e8e3db',
                    }}
                    title={img.color}
                  >
                    <div
                      className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: img.color_code }}
                    ></div>
                    <span className="text-xs text-foreground text-center font-medium line-clamp-1">
                      {img.color}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-bold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-accent hover:bg-accent/90 text-white text-lg py-6 disabled:opacity-50"
            >
              <ShoppingCartIcon className="mr-2 w-5 h-5" />
              Add to Cart
            </Button>

            {/* Product Features */}
            <Card className="bg-secondary/50">
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-4">
                  Why You&apos;ll Love This Thread
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>✓ Premium quality material</li>
                  <li>✓ Available in multiple colors</li>
                  <li>✓ Perfect for hand and machine sewing</li>
                  <li>✓ Fast and reliable shipping</li>
                  <li>✓ 30-day money-back guarantee</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
