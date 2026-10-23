export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: Request) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY
    if (!stripeSecret) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 })
    }
    const stripe = new Stripe(stripeSecret)
    const body = await req.json()
    const title = typeof body.title === "string" ? body.title.trim() : ""
    const image = typeof body.image === "string" ? body.image.trim() : ""
    const variantId = typeof body.variantId === "string" || typeof body.variantId === "number" ? String(body.variantId) : ""
    const productId = typeof body.productId === "string" || typeof body.productId === "number" ? String(body.productId) : ""
    const price = Number(body.price)

    if (!title || !variantId || !productId || !Number.isInteger(price) || price <= 0 || price > 10000000) {
      return NextResponse.json({ error: "Invalid product data" }, { status: 400 })
    }

    if (image) {
      try {
        const imageUrl = new URL(image)
        if (imageUrl.protocol !== "https:") throw new Error("Unsupported image URL")
      } catch {
        return NextResponse.json({ error: "Invalid image URL" }, { status: 400 })
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dez-store.vercel.app'

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              images: image? [image] : [],
            },
            unit_amount: Number(price),
          },
          quantity: 1,
        },
      ],
      metadata: {
        printify_product_id: String(productId),
        printify_variant_id: String(variantId),
        type: "printify",
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/printify-store`,
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error("Checkout error", e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
