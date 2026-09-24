export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ ok: true, skipped: true, message: 'sync-stripe-to-shopify disabled for build - add env vars later' })
}
export async function GET() { return POST() }
