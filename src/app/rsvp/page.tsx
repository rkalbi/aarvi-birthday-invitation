"use client"
import { useEffect, useMemo, useState } from 'react'
import Captcha, { type CaptchaResult } from '@/components/Captcha'

type Rsvp = {
  id: string
  name: string
  status: 'yes' | 'no'
  guests: number
  message: string | null
}

export default function RsvpPage() {
  const [name, setName] = useState('')
  const [inviteKey, setInviteKey] = useState('')
  const [status, setStatus] = useState<'yes' | 'no'>('yes')
  const [guests, setGuests] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Rsvp | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [captcha, setCaptcha] = useState<CaptchaResult | null>(null)

  const isValid = useMemo(() => name.trim().length > 0 && guests >= 1 && guests <= 10 && inviteKey.trim().length > 0, [name, guests, inviteKey])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (!id || !inviteKey) return
    ;(async () => {
      try {
        const res = await fetch(`/api/rsvp?id=${id}`, { headers: { 'x-invite-key': inviteKey }, cache: 'no-store' })
        if (res.ok) {
          const text = await res.text()
          if (!text || text.trim().length === 0) return
          let data: any = null
          try { data = JSON.parse(text) } catch { return }
          const r: Rsvp = data.rsvp
          if (!r) return
          setResult(r)
          setName(r.name)
          setStatus(r.status)
          setGuests(r.guests)
          setMessage(r.message ?? '')
        }
      } catch {}
    })()
  }, [inviteKey])

  async function submit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-invite-key': inviteKey },
        body: JSON.stringify({ id: result?.id, name, status, guests, message: message || null, inviteKey, captcha }),
        cache: 'no-store',
      })
      const text = await res.text()
      let data: any = null
      if (text && text.trim().length > 0) {
        try { data = JSON.parse(text) } catch { throw new Error('Invalid server response') }
      }
      if (!res.ok) throw new Error((data && data.error) || `Failed to save (${res.status})`)
      if (!data?.rsvp) throw new Error('Empty server response')
      setResult(data.rsvp)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6">
      <div className="card max-w-2xl w-full p-6">
        <h1 className="text-2xl font-bold text-brand-700">RSVP</h1>
        <p className="mt-1 text-sm text-zinc-600">Please let us know if you can make it.</p>

        <div className="mt-6 grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Invite Key</span>
            <input className="input" value={inviteKey} onChange={e => setInviteKey(e.target.value)} placeholder="Enter the key from your invitation" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Your Name</span>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Deepak Kalbi" />
          </label>

          <div className="grid gap-2">
            <span className="text-sm font-medium">Will you attend?</span>
            <div className="flex gap-3">
              <button type="button" className={`btn ${status === 'yes' ? '' : 'bg-zinc-300 text-zinc-800 hover:bg-zinc-400'}`} onClick={() => setStatus('yes')}>Yes</button>
              <button type="button" className={`btn ${status === 'no' ? '' : 'bg-zinc-300 text-zinc-800 hover:bg-zinc-400'}`} onClick={() => setStatus('no')}>No</button>
            </div>
          </div>

          <label className="grid gap-1">
            <span className="text-sm font-medium">How many guests including you?</span>
            <input type="number" min={1} max={10} className="input" value={guests} onChange={e => setGuests(Number(e.target.value))} />
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Dietary restrictions or notes (optional)</span>
            <textarea className="input min-h-[80px]" value={message} onChange={e => setMessage(e.target.value)} placeholder="Please share any dietary restrictions (e.g., nut allergy, vegetarian) or other notes" />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Captcha onSolved={setCaptcha} />

          <button disabled={!isValid || loading || !captcha} onClick={submit} className="btn">
            {loading ? 'Saving...' : result?.id ? 'Update RSVP' : 'Submit RSVP'}
          </button>

          {result && (
            <div className="mt-2 text-sm text-zinc-700">
              <p>Your RSVP code: <span className="font-mono font-semibold">{result.id}</span></p>
              <p className="mt-1">Save this link to update later: <a className="text-brand-700 underline" href={`/rsvp?id=${result.id}`}>{typeof window !== 'undefined' ? `${window.location.origin}/rsvp?id=${result.id}` : `/rsvp?id=${result.id}`}</a></p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}


