import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/stripe'

const schema = z.object({ productId: z.string().trim().min(1).max(100) })

export async function POST(request: Request) {
  try {
    const stripe = getStripe()
    const { productId } = schema.parse(await request.json())
    const product = await stripe.products.retrieve(productId, { expand: ['default_price'] })
    if (!product.active || !product.default_price || typeof product.default_price === 'string') return NextResponse.json({ error: 'Product unavailable.' }, { status: 404 })
    const price = product.default_price
    if (!price.active || price.unit_amount === null || !price.currency) return NextResponse.json({ error: 'Product price unavailable.' }, { status: 409 })
    const origin = new URL(request.url).origin
    const session = await stripe.checkout.sessions.create({ mode: 'payment', line_items: [{ price: price.id, quantity: 1 }], success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/`, submit_type: 'pay', allow_promotion_codes: true }, { idempotencyKey: `checkout-${crypto.randomUUID()}` })
    if (!session.url) return NextResponse.json({ error: 'Checkout URL unavailable.' }, { status: 502 })
    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Invalid product selection.' }, { status: 400 })
    return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 503 })
  }
}
