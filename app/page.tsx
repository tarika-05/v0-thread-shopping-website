import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Boxes, PackageCheck, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { fetchThreadHubProducts, ThreadHubProduct, yarnCategories } from '@/lib/threadhub'

export default async function HomePage() {
  let products: ThreadHubProduct[] = []
  try {
    products = await fetchThreadHubProducts()
  } catch {
    products = []
  }

  const featured = products.slice(0, 4)
  const inStock = products.filter((product) => product.stock > 0).length
  const categoryCounts = yarnCategories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category?.toLowerCase() === category.value).length,
  }))

  return (
    <main className="bg-background">
      <section className="relative overflow-hidden border-b border-border bg-primary text-primary-foreground">
        <div className="absolute inset-y-0 right-0 hidden w-[48%] lg:block" aria-hidden="true">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/55 to-transparent" />
          <img src="/yarns/polyester-cone-1.png" alt="" className="h-full w-full object-cover object-center opacity-70" />
        </div>
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-300"><span className="size-1.5 rounded-full bg-sky-300" /> ThreadHub · B2B textile marketplace</p>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Materials for your next great textile.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">Source yarns and threads with the specs that matter: clear MOQs, live stock, bulk tiers, and technical details in one place.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/browse"><Button className="bg-sky-500 px-5 text-white hover:bg-sky-400">Explore the catalog <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Button></Link>
              <Link href="/categories"><Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white">Browse categories</Button></Link>
            </div>
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/20 pt-5">
              <div><p className="text-2xl font-semibold">{products.length}</p><p className="mt-1 text-xs text-slate-300">Catalog products</p></div>
              <div><p className="text-2xl font-semibold">{yarnCategories.length}</p><p className="mt-1 text-xs text-slate-300">Material categories</p></div>
              <div><p className="text-2xl font-semibold">{inStock}</p><p className="mt-1 text-xs text-slate-300">Currently in stock</p></div>
            </div>
          </div>
          <div className="relative hidden min-h-[360px] lg:block" aria-hidden="true">
            <div className="absolute right-2 top-8 h-[330px] w-[300px] overflow-hidden rounded-2xl border border-white/20 bg-white/5 shadow-2xl">
              <img src="/yarns/polyester-cone-1.png" alt="" className="h-full w-full object-cover" />
            </div>
            <div className="absolute bottom-2 left-0 rounded-xl border border-white/15 bg-slate-950/70 p-4 backdrop-blur">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-sky-300">For makers & manufacturers</p>
              <p className="mt-1 text-sm font-medium">Technical details. Straightforward sourcing.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8" aria-labelledby="categories-heading">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Find your material</p><h2 id="categories-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Shop by category</h2><p className="mt-2 text-sm text-muted-foreground">Explore fibers for apparel, interiors, craft, and technical use.</p></div>
          <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent">All categories <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {categoryCounts.map((category) => <Link key={category.value} href={`/browse?category=${category.value}`} className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
            <div className="aspect-[1.3] overflow-hidden bg-secondary"><img src={category.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" /></div>
            <div className="flex items-center justify-between gap-2 p-3"><div><h3 className="text-sm font-medium leading-tight">{category.label}</h3><p className="mt-1 text-xs text-muted-foreground">{category.count} {category.count === 1 ? 'product' : 'products'}</p></div><ArrowUpRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" /></div>
          </Link>)}
        </div>
      </section>

      <section id="featured" className="border-y border-border bg-secondary/40" aria-labelledby="featured-heading">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">From the catalog</p><h2 id="featured-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Featured materials</h2><p className="mt-2 text-sm text-muted-foreground">Compare specs and minimum quantities before you buy.</p></div><Link href="/browse"><Button variant="outline">View all products <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Button></Link></div>
          {featured.length ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center"><p className="font-medium">The catalog is temporarily unavailable.</p><p className="mt-2 text-sm text-muted-foreground">Please try browsing again in a moment.</p></div>}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 sm:py-20 md:grid-cols-3 lg:px-8" aria-label="Marketplace benefits">
        {[{ icon: Boxes, title: 'Bulk-ready ordering', body: 'See minimum quantities and bulk price tiers before adding products to your cart.' }, { icon: Ruler, title: 'Specifications up front', body: 'Review material, weight, thickness, tensile strength, and cone size on product pages.' }, { icon: PackageCheck, title: 'Stock visibility', body: 'Check listed availability and choose materials that fit your production requirements.' }].map(({ icon: Icon, title, body }) => <article key={title} className="rounded-lg border border-border bg-card p-5"><div className="mb-4 flex size-10 items-center justify-center rounded-md bg-primary/5 text-primary"><Icon aria-hidden="true" className="size-5" /></div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></article>)}
      </section>

      <section className="bg-primary px-4 py-12 text-primary-foreground sm:px-6 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">Start sourcing</p><h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Find the right yarn for your next run.</h2><p className="mt-2 max-w-xl text-sm text-slate-200">Browse the catalog and compare minimum order quantities, stock, and technical specifications.</p></div><Link href="/browse"><Button className="shrink-0 bg-sky-500 text-white hover:bg-sky-400">Explore products <ArrowRight className="ml-2 size-4" aria-hidden="true" /></Button></Link></div>
      </section>
    </main>
  )
}
