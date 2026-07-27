import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { AuthProvider } from './auth-context'
import { CartProvider } from './cart-context'
import { WishlistProvider } from './wishlist-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'LUXE - Premium Fashion & Clothing',
  description: 'Discover our curated collection of luxury fashion, premium clothing, and timeless pieces for modern life.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
