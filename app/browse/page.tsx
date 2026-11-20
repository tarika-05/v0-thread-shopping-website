'use client'

import { Suspense, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useSearchParams } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { ProductFiltersState, ThreadHubFilters } from '@/components/threadhub-filters'
import { fetchThreadHubProducts } from '@/lib/threadhub'
import { SlidersHorizontal } from 'lucide-react'

function BrowseProducts() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')
  const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
  const [filters, setFilters] = useState<ProductFiltersState>({
    categories: initialCategory && initialCategory !== 'all' ? [initialCategory] : [],
    materials: [],
    maxPrice: 5000,
  })
  const [showFilters, setShowFilters] = useState(false)
  const { data: products = [], error, isLoading } = useSWR('threadhub-products', fetchThreadHubProducts)
  const priceCap = Math.max(5000, ...products.map((product) => product.price))
  const materials = [...new Set(products.map((product) => product.material_type || product.material).filter(Boolean) as string[])].sort()
  const filteredProducts = useMemo(() => products.filter((product) => {
    const searchable = `${product.name} ${product.description ?? ''} ${product.category ?? ''} ${product.sku ?? ''} ${product.material_type ?? ''} ${product.material ?? ''}`.toLowerCase()
    return (!filters.categories.length || filters.categories.includes(product.category ?? '')) &&
      (!filters.materials.length || filters.materials.includes(product.material_type || product.material || '')) &&
      product.price <= filters.maxPrice &&
      (!search || searchable.includes(search))
  }), [products, filters, search])
  const title = search ? `Results for “${searchParams.get('search')}”` : initialCategory && initialCategory !== 'all' ? `${initialCategory.charAt(0).toUpperCase()}${initialCategory.slice(1)} yarns` : 'Yarns & threads'

  return (
    <main className="min-h-[60vh] bg-background">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 border-b border-border pb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">ThreadHub · B2B textile marketplace</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 text-sm text-muted-foreground">Source dependable fibers with clear specs, stock, and wholesale tiers.</p></div>
            <p className="text-sm text-muted-foreground" aria-live="polite">{isLoading ? 'Loading catalog…' : `${filteredProducts.length} of ${products.length} products`}</p>
          </div>
        </div>
        <button type="button" aria-expanded={showFilters} onClick={() => setShowFilters(!showFilters)} className="mb-4 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium lg:hidden"><SlidersHorizontal aria-hidden="true" className="h-4 w-4" /> Filters</button>
        <div className="grid gap-7 lg:grid-cols-[230px_minmax(0,1fr)]">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}><ThreadHubFilters materials={materials} priceCap={priceCap} value={filters} onChange={setFilters} onReset={() => setFilters({ categories: [], materials: [], maxPrice: priceCap })} /></div>
          <div>
            {isLoading ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="animate-pulse"><div className="aspect-square bg-secondary" /><div className="mt-3 h-4 w-3/4 bg-secondary" /><div className="mt-2 h-4 w-1/2 bg-secondary" /></div>)}</div> : error ? <div role="alert" className="rounded-lg border border-border p-10 text-center"><h2 className="font-semibold">Catalog unavailable</h2><p className="mt-2 text-sm text-muted-foreground">We couldn&apos;t reach the product catalog. Please try again shortly.</p></div> : filteredProducts.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-lg border border-dashed border-border p-12 text-center"><h2 className="font-semibold">No products match these filters</h2><p className="mt-2 text-sm text-muted-foreground">Adjust your filters or clear them to see more yarns.</p><button type="button" onClick={() => setFilters({ categories: [], materials: [], maxPrice: priceCap })} className="mt-4 text-sm font-medium text-accent hover:underline">Clear filters</button></div>}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function BrowsePage() {
  return <Suspense fallback={<main className="min-h-[60vh] animate-pulse bg-background" />}><BrowseProducts /></Suspense>
}
