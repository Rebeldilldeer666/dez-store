import 'server-only'
import Stripe from 'stripe'

export function assertStripeConfigured() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error('Stripe is not configured')
}

export function getStripe() {
  assertStripeConfigured()
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}
