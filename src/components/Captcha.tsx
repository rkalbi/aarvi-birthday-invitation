"use client"
import { useEffect, useState } from 'react'

type Challenge = { kind: 'pick-emoji'; prompt: string; target: string; options: string[] }
type CaptchaBundle = { nonce: string; ts: string; token: string; challenge: Challenge }

export type CaptchaResult = { nonce: string; ts: string; token: string; answer: string }

export default function Captcha({ onSolved }: { onSolved: (c: CaptchaResult | null) => void }) {
  const [bundle, setBundle] = useState<CaptchaBundle | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    setBundle(null)
    try {
      const res = await fetch('/api/captcha', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load captcha')
      setBundle(await res.json())
      onSolved(null)
    } catch (e: any) {
      setError(e.message)
    }
  }

  useEffect(() => { load() }, [])

  function clickOption(opt: string) {
    if (!bundle) return
    if (opt === bundle.challenge.target) {
      onSolved({ nonce: bundle.nonce, ts: bundle.ts, token: bundle.token, answer: opt })
    } else {
      setError('Oops, try again!')
      onSolved(null)
    }
  }

  if (!bundle) return <div className="card p-3 text-sm">Loading challenge...</div>
  const ch = bundle.challenge
  return (
    <div className="card p-3">
      <div className="text-sm font-medium">{ch.prompt}</div>
      <div className="mt-2 flex gap-2">
        {ch.options.map((o) => (
          <button key={o} onClick={() => clickOption(o)} className="btn px-3 py-1 text-lg">{o}</button>
        ))}
      </div>
      <div className="mt-2 text-xs text-zinc-500">A tiny friendly check to keep bots away.</div>
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
      <div className="mt-2">
        <button className="text-xs text-brand-700 underline" onClick={load}>New challenge</button>
      </div>
    </div>
  )
}


