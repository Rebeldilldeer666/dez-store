import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'

export async function GET() {
  try { const stripe = getStripe(); const products = await stripe.products.list({ active: true, expand: ['data.default_price'] }); return NextResponse.json({ products: products.data.filter((p) => p.default_price && typeof p.default_price !== 'string').map((p) => { const price = p.default_price as Stripe.Price; return { id: p.id, name: p.name, description: p.description ?? 'Digital resource from Dez Store.', amount: price.unit_amount ?? 0, currency: price.currency } }) }) } catch { return NextResponse.json({ error: 'Catalog unavailable', products: [] }, { status: 503 }) }
}
