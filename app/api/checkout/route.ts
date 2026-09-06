import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'

const schema = z.object({ productId: z.string().min(1).max(200) })
export async function POST(request: Request) {
  try { const stripe = getStripe(); const input = schema.parse(await request.json()); const product = await stripe.products.retrieve(input.productId, { expand: ['default_price'] }); if (!product.active || !product.default_price || typeof product.default_price === 'string') return NextResponse.json({ error: 'Product unavailable' }, { status: 404 }); const price = product.default_price; const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price: price.id, quantity: 1 }], success_url: `${new URL(request.url).origin}/success`, cancel_url: `${new URL(request.url).origin}/`, submit_type: 'pay' }, { idempotencyKey: `checkout-${crypto.randomUUID()}` }); return NextResponse.json({ url: session.url }) } catch { return NextResponse.json({ error: 'Unable to start checkout' }, { status: 400 }) }
}
