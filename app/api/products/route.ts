export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';
export async function GET(){
  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 })

  try {
    const stripe = new Stripe(secret, { apiVersion: '2024-06-20' as any })
    const p = await stripe.products.list({ active: true, expand: ['data.default_price'], limit: 20 })
    return NextResponse.json(
      p.data.map((x) => ({ name: x.name, priceId: typeof x.default_price === 'string' ? x.default_price : (x.default_price as any)?.id, price: (x.default_price as any)?.unit_amount })).filter((x) => x.priceId),
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    return NextResponse.json({ error: 'Unable to load products' }, { status: 502 })
  }
}
