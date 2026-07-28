import Link from 'next/link'

interface Collection {
  id: string
  name: string
  slug: string
  image: string
  color: string
}

const collections: Collection[] = [
  {
    id: '1',
    name: "Men's Collection",
    slug: 'mens',
    image: '/fashion/mens-shirt-navy.png',
    color: '#1a1a1a',
  },
  {
    id: '2',
    name: "Women's Collection",
    slug: 'womens',
    image: '/fashion/womens-black-dress.png',
    color: '#2a2a2a',
  },
  {
    id: '3',
    name: 'Essentials',
    slug: 'oversized',
    image: '/fashion/oversized-tee-white.png',
    color: '#3a3a3a',
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-accent font-medium text-sm uppercase tracking-widest mb-3">
            Collections
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collections featuring the latest trends and timeless classics.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {collections.map((collection) => (
            <Link key={collection.id} href={`/?category=${collection.slug}`}>
              <div className="relative group cursor-pointer overflow-hidden bg-gray-100 aspect-square">
                {/* Image */}
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4">
                    {collection.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white text-sm font-medium group-hover:gap-4 transition-all">
                    <span>Shop</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
