'use client'

import Link from 'next/link'
import { Mail, Facebook, Twitter, Instagram } from 'lucide-react'
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
    <footer className="bg-black text-white border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-black py-16 sm:py-20 px-4 sm:px-6 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Newsletter Text */}
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Newsletter</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
              </p>
            </div>

            {/* Newsletter Form */}
            <form
              onSubmit={handleNewsletterSignup}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
            {subscribed && (
              <p className="text-accent text-sm col-span-full">Thank you for subscribing!</p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">THREADS</h3>
            <p className="text-gray-400 text-sm mb-6">
              Contemporary fashion designed for the modern lifestyle. Quality, style, and sustainability.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Shop</h4>
            <ul className="space-y-3">
              {[
                { name: "Men's", slug: 'mens' },
                { name: "Women's", slug: 'womens' },
                { name: 'Oversized', slug: 'oversized' },
                { name: 'Hoodies', slug: 'hoodies' },
                { name: 'Sale', slug: 'sale' },
              ].map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/?category=${item.slug}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Support</h4>
            <ul className="space-y-3">
              {[
                { name: 'Contact Us', href: '#' },
                { name: 'Shipping & Returns', href: '#' },
                { name: 'Size Guide', href: '#' },
                { name: 'FAQ', href: '#' },
                { name: 'Care Instructions', href: '#' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Company</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '#' },
                { name: 'Sustainability', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Press', href: '#' },
                { name: 'My Account', href: '/account' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left - Payment Methods */}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-3">Payment Methods</p>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                  <div
                    key={method}
                    className="px-2 py-1 border border-gray-700 text-gray-400 text-xs"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>

            {/* Center - Legal Links */}
            <div className="flex flex-wrap gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms & Conditions
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Settings
              </a>
            </div>

            {/* Right - Copyright */}
            <p className="text-gray-400 text-sm">
              &copy; 2024 THREADS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
