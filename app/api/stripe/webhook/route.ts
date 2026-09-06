import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) { try { const stripe = getStripe(); const signature = request.headers.get('stripe-signature'); const secret = process.env.STRIPE_WEBHOOK_SECRET; if (!signature || !secret) return new NextResponse('Missing webhook configuration', { status: 400 }); const event = stripe.webhooks.constructEvent(await request.text(), signature, secret); if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') { const session = event.data.object; if (session.payment_status === 'paid') console.log('[v0] Payment confirmed:', session.id) } return NextResponse.json({ received: true })   } catch (error) {
    console.error('[v0] Stripe webhook failed:', error instanceof Error ? error.message : 'Unknown webhook error')
    return new NextResponse('Invalid webhook', { status: 400 })
  } }
