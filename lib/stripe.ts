import 'server-only'
import Stripe from 'stripe'

export function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe is not configured')
}

export function getStripe() {
  assertStripeConfigured()
  const key = process.env.STRIPE_SECRET_KEY!
  return new Stripe(key)
}

export function stripeMode() {
  const key = process.env.STRIPE_SECRET_KEY ?? ''
  return key.startsWith('sk_live_') ? 'live' : key.startsWith('sk_test_') ? 'test' : 'unknown'
}
