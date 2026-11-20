'use client'

import { yarnCategories } from '@/lib/threadhub'

export interface ProductFiltersState {
  categories: string[]
  materials: string[]
  maxPrice: number
}

export function ThreadHubFilters({
  materials,
  priceCap,
  value,
  onChange,
  onReset,
}: {
  materials: string[]
  priceCap: number
  value: ProductFiltersState
  onChange: (next: ProductFiltersState) => void
  onReset: () => void
}) {
  const toggle = (key: 'categories' | 'materials', item: string) => {
    const current = value[key]
    onChange({
      ...value,
      [key]: current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item],
    })
  }

  return (
    <aside aria-label="Product filters" className="space-y-7 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Filters</h2>
        <button type="button" onClick={onReset} className="text-xs font-medium text-accent hover:underline">Clear all</button>
      </div>
      <fieldset>
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Categories</legend>
        <div className="max-h-64 space-y-2 overflow-y-auto">
          {yarnCategories.map((category) => (
            <label key={category.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" checked={value.categories.includes(category.value)} onChange={() => toggle('categories', category.value)} className="h-4 w-4 rounded border-border accent-slate-900" />
              <span>{category.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="border-t border-border pt-6">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Maximum price</legend>
        <label htmlFor="price-range" className="mb-2 block text-sm font-medium">Up to ₹{value.maxPrice.toLocaleString('en-IN')}</label>
        <input id="price-range" type="range" min={0} max={priceCap} step={100} value={value.maxPrice} onChange={(event) => onChange({ ...value, maxPrice: Number(event.target.value) })} className="w-full accent-slate-900" />
        <div className="flex justify-between text-[11px] text-muted-foreground"><span>₹0</span><span>₹{priceCap.toLocaleString('en-IN')}</span></div>
      </fieldset>
      <fieldset className="border-t border-border pt-6">
        <legend className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Material type</legend>
        <div className="max-h-56 space-y-2 overflow-y-auto">
          {materials.map((material) => (
            <label key={material} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="checkbox" checked={value.materials.includes(material)} onChange={() => toggle('materials', material)} className="h-4 w-4 rounded border-border accent-slate-900" />
              <span>{material}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </aside>
  )
}
