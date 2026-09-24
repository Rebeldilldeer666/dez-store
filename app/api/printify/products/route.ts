export const dynamic = "force-dynamic"
export const runtime = "nodejs"

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const token = process.env.PRINTIFY_API_TOKEN
    const shopId = process.env.PRINTIFY_SHOP_ID

    if (!token ||!shopId) {
      return NextResponse.json({ error: "Missing PRINTIFY env vars" }, { status: 500 })
    }

    const res = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    if (!res.ok) {
      const txt = await res.text()
      return NextResponse.json({ error: txt }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
