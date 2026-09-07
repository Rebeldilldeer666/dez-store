import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
export async function POST(r:NextRequest){
  const {priceId}=await r.json();
  await stripe.prices.retrieve(priceId);
  const s=await stripe.checkout.sessions.create({mode:'payment', line_items:[{price:priceId,quantity:1}], success_url:r.nextUrl.origin, cancel_url:r.nextUrl.origin});
  return NextResponse.json({url:s.url});
}
