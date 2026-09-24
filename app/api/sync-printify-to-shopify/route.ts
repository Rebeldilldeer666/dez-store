export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
export async function POST() {
  return NextResponse.json({ ok: true, skipped: true, message: 'sync-printify-to-shopify disabled for build' })
}
export async function GET() { return POST() }
