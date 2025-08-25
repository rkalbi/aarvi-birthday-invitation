import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { getClientId, rateLimit } from '@/lib/ratelimit'

const EMOJIS = ['🎂','🦄','🐼','🎈','🦊','🦁','🐰','🧁','🧚‍♀️','🦒'] as const

function pick<T>(arr: readonly T[], n: number) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export async function GET(req: NextRequest) {
  const cid = getClientId(req.headers)
  if (!rateLimit(`captcha:${cid}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429, headers: { 'Cache-Control': 'no-store' } })
  }
  const secret = process.env.CAPTCHA_SECRET || 'dev-secret'
  const nonce = crypto.randomBytes(8).toString('hex')
  const ts = Date.now().toString()
  const target = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
  const distractors = pick(EMOJIS.filter(e => e !== target), 4)
  const options = pick([target, ...distractors], 5)
  const token = crypto.createHmac('sha256', secret).update(`${nonce}:${ts}:${target}`).digest('hex')
  return NextResponse.json({ nonce, ts, token, challenge: { kind: 'pick-emoji', prompt: `Tap the ${target}`, target, options } }, { headers: { 'Cache-Control': 'no-store' } })
}


