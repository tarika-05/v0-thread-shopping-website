'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleNewsletterSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground border-t border-border/20">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-primary to-black py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
          <p className="text-primary-foreground/70 mb-6">
            Get exclusive offers and updates delivered to your inbox
          </p>
          <form
            onSubmit={handleNewsletterSignup}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-4 py-3 bg-white text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-foreground font-semibold"
            >
              Subscribe
            </Button>
          </form>
          {subscribed && (
            <p className="text-accent mt-2 text-sm">Thank you for subscribing!</p>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent rounded flex items-center justify-center">
                <span className="text-primary font-bold text-lg">L</span>
              </div>
              <h3 className="text-xl font-bold">LUXE</h3>
            </div>
            <p className="text-primary-foreground/60 mb-6">
              Premium fashion for the modern lifestyle. Discover luxury and elegance in every piece.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/60 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/?category=mens"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Men&apos;s Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=womens"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Women&apos;s Clothing
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=hoodies"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Hoodies
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=oversized-tshirts"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Oversized T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=sweatshirts"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Sweatshirts
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/account"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  My Account
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/60 hover:text-accent transition-colors"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone size={20} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-primary-foreground/60">Customer Support</p>
                  <a
                    href="tel:+1234567890"
                    className="text-primary-foreground hover:text-accent transition-colors"
                  >
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={20} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-primary-foreground/60">Email</p>
                  <a
                    href="mailto:support@luxe.com"
                    className="text-primary-foreground hover:text-accent transition-colors"
                  >
                    support@luxe.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm text-primary-foreground/60">Address</p>
                  <p className="text-primary-foreground">
                    123 Fashion Street
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-8">
          {/* Payment Methods */}
          <div className="mb-6 pb-6 border-b border-border/20">
            <p className="text-sm text-primary-foreground/60 mb-3">We Accept</p>
            <div className="flex flex-wrap gap-3">
              {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'].map(
                (method) => (
                  <div
                    key={method}
                    className="px-3 py-1 bg-primary-foreground/10 rounded text-xs text-primary-foreground/80"
                  >
                    {method}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Bottom Links & Copyright */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-primary-foreground/60">
            <div className="flex flex-wrap gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Cookie Policy
              </a>
            </div>
            <p>
              &copy; 2024 LUXE Fashion. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
