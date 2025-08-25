import { NextRequest, NextResponse } from 'next/server'
import { ensureSchema, createOrUpdateRsvp, getRsvpById } from '@/lib/db'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'
import { getClientId, rateLimit } from '@/lib/ratelimit'

const nano = customAlphabet('abcdefghjkmnpqrstuvwxyz23456789', 8)

const bodySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1).max(80),
  status: z.enum(['yes', 'no']),
  guests: z.number().int().min(1).max(10),
  message: z.string().max(300).optional().nullable(),
  captcha: z.object({ nonce: z.string(), ts: z.string(), token: z.string(), answer: z.string() }).optional(),
})

export async function POST(req: NextRequest) {
  await ensureSchema()
  const json = await req.json().catch(() => null)
  const providedKey = (req.headers.get('x-invite-key') || (json && (json as any).inviteKey) || '').trim()
  const requiredKey = (process.env.INVITE_KEY || '').trim()
  if (requiredKey && providedKey !== requiredKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const cid = getClientId(req.headers)
  if (!rateLimit(`rsvp:${cid}`, 8, 60_000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 })
  }
  const parse = bodySchema.safeParse(json)
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const { id, name, status, guests, message } = parse.data
  // verify captcha if secret is set
  if (process.env.CAPTCHA_SECRET) {
    const cap = (json as any)?.captcha
    if (!cap?.nonce || !cap?.ts || !cap?.token || !cap?.answer) {
      return NextResponse.json({ error: 'Captcha required' }, { status: 400 })
    }
    const computed = require('crypto').createHmac('sha256', process.env.CAPTCHA_SECRET).update(`${cap.nonce}:${cap.ts}:${cap.answer}`).digest('hex')
    if (computed !== cap.token) {
      return NextResponse.json({ error: 'Captcha invalid' }, { status: 400 })
    }
  }
  const rsvpId = id ?? nano()
  const saved = await createOrUpdateRsvp(rsvpId, name.trim(), status, guests, message ?? null)
  return NextResponse.json({ rsvp: saved })
}

export async function GET(req: NextRequest) {
  await ensureSchema()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const providedKey = (req.headers.get('x-invite-key') || '').trim()
  const requiredKey = (process.env.INVITE_KEY || '').trim()
  if (requiredKey && providedKey !== requiredKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const rsvp = await getRsvpById(id)
  if (!rsvp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ rsvp })
}


