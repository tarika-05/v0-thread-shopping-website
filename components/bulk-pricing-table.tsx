'use client'

interface PricingTier {
  min_quantity: number
  max_quantity?: number
  price_per_unit: number
  discount_percent: number
}

interface BulkPricingTableProps {
  basePrice: number
  pricingTiers?: PricingTier[]
}

export function BulkPricingTable({ basePrice, pricingTiers = [] }: BulkPricingTableProps) {
  const defaultTiers: PricingTier[] = [
    { min_quantity: 1, max_quantity: 9, price_per_unit: basePrice, discount_percent: 0 },
    { min_quantity: 10, max_quantity: 49, price_per_unit: basePrice * 0.92, discount_percent: 8 },
    { min_quantity: 50, max_quantity: 99, price_per_unit: basePrice * 0.85, discount_percent: 15 },
    { min_quantity: 100, max_quantity: 249, price_per_unit: basePrice * 0.78, discount_percent: 22 },
    { min_quantity: 250, price_per_unit: basePrice * 0.7, discount_percent: 30 },
  ]

  const tiers = pricingTiers.length > 0 ? pricingTiers : defaultTiers

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Price/Unit</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Discount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Total (1000 units)</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, idx) => {
              const quantityDisplay = tier.max_quantity
                ? `${tier.min_quantity} - ${tier.max_quantity}`
                : `${tier.min_quantity}+`
              const totalFor1000 = (tier.price_per_unit * 1000).toFixed(2)
              
              return (
                <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground">{quantityDisplay}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    ${tier.price_per_unit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {tier.discount_percent > 0 && (
                      <span className="inline-block bg-accent/10 text-accent px-2 py-1 rounded text-xs font-medium">
                        {tier.discount_percent}% off
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-accent">${totalFor1000}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
