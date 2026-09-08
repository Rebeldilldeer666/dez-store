export const dynamic = "force-dynamic"
export const runtime = "nodejs"
import { NextResponse } from 'next/server'
export async function GET() {
  const token = process.env.PRINTIFY_API_TOKEN
  const shopId = process.env.PRINTIFY_SHOP_ID
  const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store"
  })
  const text = await res.text()
  return new NextResponse(text, { headers: { "Content-Type": "application/json" } })
}
