import { NextRequest, NextResponse } from 'next/server'
import { ensureSchema, listRsvps } from '@/lib/db'
import { getClientId, rateLimit } from '@/lib/ratelimit'

function isAuthorized(req: NextRequest) {
  const key = req.headers.get('x-admin-key') || new URL(req.url).searchParams.get('key')
  return !!key && key === process.env.ADMIN_KEY
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } })
  }
  const cid = getClientId(req.headers)
  if (!rateLimit(`admin:${cid}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Cache-Control': 'no-store' } })
  }
  await ensureSchema()
  const rows = await listRsvps()
  return NextResponse.json({ rsvps: rows }, { headers: { 'Cache-Control': 'no-store' } })
}


