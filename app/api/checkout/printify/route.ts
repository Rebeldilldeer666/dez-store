import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  try {
    const { title, price, image, variantId, productId } = await req.json()
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
            images: image? [image] : [],
            description: `Dez Rebel - Printify ID: ${productId} Variant: ${variantId}`
          },
          unit_amount: price,
        },
        quantity: 1,
      }],
      metadata: {
        printify_product_id: String(productId),
        printify_variant_id: String(variantId),
        type: "printify"
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dez-store.vercel.app'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dez-store.vercel.app'}/printify-store`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
