import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

export const revalidate = 60

export async function GET() {
  try {
    const stripe = getStripe()
    const [account, products] = await Promise.all([
      stripe.accounts.retrieve('self'),
      stripe.products.list({ active: true, limit: 100, expand: ['data.default_price'] }).autoPagingToArray({ limit: 1000 }),
    ])
    const normalized = products.flatMap((product) => {
      const price = product.default_price
      if (!price || typeof price === 'string' || price.unit_amount === null || !price.currency) return []
      const kind = product.metadata.fulfillment === 'physical' ? 'physical' : 'digital'
      return [{ id: product.id, name: product.name, description: product.description ?? 'A considered resource from Dez Store.', amount: price.unit_amount, currency: price.currency, kind }]
    })
    return NextResponse.json({
      products: normalized,
      total: products.length,
      purchasable: normalized.length,
      missingDefaultPrice: products.length - normalized.length,
      stripeAccount: account.id,
      livemode: products.some((product) => product.livemode),
    }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } })
  } catch { return NextResponse.json({ error: 'Catalog unavailable', products: [] }, { status: 503 }) }
}
