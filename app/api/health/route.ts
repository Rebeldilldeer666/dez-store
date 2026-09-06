import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checkedAt = new Date().toISOString()
  try {
    const stripe = getStripe()
    const account = await stripe.accounts.retrieve('self')
    const secretKey = process.env.STRIPE_SECRET_KEY ?? ''
    return NextResponse.json({ ok: true, service: 'dez-store', checkedAt, stripe: { configured: true, account: account.id, livemode: secretKey.startsWith('sk_live_') } })
  } catch {
    return NextResponse.json({ ok: false, service: 'dez-store', checkedAt, stripe: { configured: Boolean(process.env.STRIPE_SECRET_KEY) } }, { status: 503 })
  }
}
