'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FilterProps {
  onCategoryChange?: (category: string) => void
  onPriceChange?: (min: number, max: number) => void
  onMaterialChange?: (material: string) => void
  onMoqChange?: (moq: number) => void
}

const yarnCategories = [
  { label: 'Acrylic', value: 'acrylic' },
  { label: 'Blended', value: 'blended' },
  { label: 'Cotton', value: 'cotton' },
  { label: 'Embroidery', value: 'embroidery' },
  { label: 'Linen', value: 'linen' },
  { label: 'Nylon', value: 'nylon' },
  { label: 'Polyester', value: 'polyester' },
  { label: 'Silk', value: 'silk' },
  { label: 'Spandex', value: 'spandex' },
  { label: 'Technical', value: 'technical' },
  { label: 'Wool', value: 'wool' },
]

const priceRanges = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: 'Over $1000', min: 1000, max: 999999 },
]

const materials = ['100% Cotton', '100% Wool', 'Cotton Blend', 'Synthetic', 'Mixed Fiber']
const moqOptions = [
  { label: 'Any MOQ', value: 0 },
  { label: 'MOQ ≤ 50', value: 50 },
  { label: 'MOQ ≤ 100', value: 100 },
  { label: 'MOQ ≤ 500', value: 500 },
]

export function ThreadHubFilters({
  onCategoryChange,
  onPriceChange,
  onMaterialChange,
  onMoqChange,
}: FilterProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    material: true,
    moq: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="w-full space-y-4">
      {/* Category Filter */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="flex items-center justify-between w-full py-2 hover:text-accent transition-colors"
        >
          <h3 className="font-semibold text-foreground">Yarn Category</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.category ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.category && (
          <div className="space-y-2 mt-3">
            {yarnCategories.map((cat) => (
              <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onCategoryChange?.(e.target.checked ? cat.value : '')}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">{cat.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full py-2 hover:text-accent transition-colors"
        >
          <h3 className="font-semibold text-foreground">Price Range</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.price && (
          <div className="space-y-2 mt-3">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  onChange={() => onPriceChange?.(range.min, range.max)}
                  className="w-4 h-4 rounded-full border-border"
                />
                <span className="text-sm text-foreground">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Material Filter */}
      <div className="border-b border-border pb-4">
        <button
          onClick={() => toggleSection('material')}
          className="flex items-center justify-between w-full py-2 hover:text-accent transition-colors"
        >
          <h3 className="font-semibold text-foreground">Material</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.material ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.material && (
          <div className="space-y-2 mt-3">
            {materials.map((mat) => (
              <label key={mat} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  onChange={(e) => onMaterialChange?.(e.target.checked ? mat : '')}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm text-foreground">{mat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* MOQ Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('moq')}
          className="flex items-center justify-between w-full py-2 hover:text-accent transition-colors"
        >
          <h3 className="font-semibold text-foreground">Minimum Order Qty</h3>
          <ChevronDown
            size={18}
            className={`transition-transform ${expandedSections.moq ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.moq && (
          <div className="space-y-2 mt-3">
            {moqOptions.map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="moq"
                  onChange={() => onMoqChange?.(opt.value)}
                  className="w-4 h-4 rounded-full border-border"
                />
                <span className="text-sm text-foreground">{opt.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
