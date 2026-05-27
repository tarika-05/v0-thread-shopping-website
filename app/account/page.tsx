'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package, LogOut, User, Mail, Calendar, DollarSign } from 'lucide-react'

interface Order {
  id: string
  total_price: number
  payment_method: string
  status: string
  created_at: string
  order_items: Array<{
    id: string
    product_id: string
    color: string
    quantity: number
    price: number
  }>
}

export default function AccountPage() {
  const router = useRouter()
  const { session, signOut } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            total_price,
            payment_method,
            status,
            created_at,
            order_items (
              id,
              product_id,
              color,
              quantity,
              price
            )
          `)
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('[v0] Fetch orders error:', error)
        } else {
          setOrders(data || [])
        }
      } catch (error) {
        console.error('[v0] Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [session, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('[v0] Sign out error:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'processing':
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              My Account
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {session.user.email}
            </p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-accent" />
                Profile Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-accent" />
                    {session.user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Member Since
                  </p>
                  <p className="flex items-center gap-2 text-foreground">
                    <Calendar className="w-4 h-4 text-accent" />
                    {new Date(session.user.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Order Statistics
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    {orders.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Spent
                  </p>
                  <p className="flex items-center gap-2 text-2xl font-bold text-foreground">
                    <DollarSign className="w-5 h-5 text-accent" />
                    {orders
                      .reduce((sum, order) => sum + order.total_price, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Order History
          </h2>

          {loading ? (
            <Card>
              <CardContent className="p-8">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted rounded-lg"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg text-muted-foreground mb-4">
                  No orders yet
                </p>
                <Link href="/">
                  <Button className="bg-accent hover:bg-accent/90 text-white">
                    Start Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Order ID
                        </p>
                        <p className="font-mono text-sm text-foreground">
                          {order.id.substring(0, 8)}...
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Order Date
                        </p>
                        <p className="text-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Payment Method
                        </p>
                        <p className="text-foreground font-semibold">
                          {order.payment_method}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Status
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-semibold text-foreground mb-2">
                        Items:
                      </p>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm text-muted-foreground"
                          >
                            <span>
                              Product {item.product_id.substring(0, 8)}... ({item.color}) x{' '}
                              {item.quantity}
                            </span>
                            <span className="font-semibold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-between items-center border-t border-border pt-4 mt-4">
                      <span className="font-bold text-foreground">
                        Order Total
                      </span>
                      <span className="text-2xl font-bold text-accent">
                        ${order.total_price.toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
