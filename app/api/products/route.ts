import Stripe from 'stripe';
import { NextResponse } from 'next/server';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });
export async function GET(){
  const p = await stripe.products.list({active:true, expand:['data.default_price'], limit:20});
  return NextResponse.json(p.data.map(x=>({name:x.name, priceId: typeof x.default_price==='string'?x.default_price:(x.default_price as any)?.id, price:(x.default_price as any)?.unit_amount})).filter(x=>x.priceId));
}
