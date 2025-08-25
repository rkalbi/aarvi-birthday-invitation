"use client"
import { useEffect, useMemo, useState } from 'react'

type Rsvp = {
  id: string
  name: string
  status: 'yes' | 'no'
  guests: number
  message: string | null
  created_at: string
}

export default function AdminPage() {
  const [key, setKey] = useState('')
  const [data, setData] = useState<Rsvp[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const stats = useMemo(() => {
    const yes = data?.filter(r => r.status === 'yes') ?? []
    const no = data?.filter(r => r.status === 'no') ?? []
    return {
      total: data?.length ?? 0,
      yes: yes.length,
      no: no.length,
      guestsYes: yes.reduce((a, r) => a + r.guests, 0),
    }
  }, [data])

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/rsvps', { headers: { 'x-admin-key': key } })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Failed to fetch')
      setData(json.rsvps)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function exportCSV() {
    if (!data) return
    const rows = [
      ['id','name','status','guests','message','created_at'],
      ...data.map(r => [r.id, r.name, r.status, String(r.guests), r.message ?? '', r.created_at])
    ]
    const escape = (val: unknown) => `"${String(val).replace(/\"/g, '""')}"`
    const csv = rows.map(r => r.map(escape).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rsvps.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    const k = localStorage.getItem('admin_key')
    if (k) setKey(k)
  }, [])

  useEffect(() => {
    if (key) localStorage.setItem('admin_key', key)
  }, [key])

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-extrabold text-brand-700">Host Dashboard</h1>
        <p className="text-zinc-600">Enter your admin key to view RSVPs.</p>

        <div className="mt-4 flex items-center gap-3">
          <input className="input max-w-sm" placeholder="Admin key" value={key} onChange={e => setKey(e.target.value)} />
          <button className="btn" onClick={load} disabled={!key || loading}>{loading ? 'Loading...' : 'Load RSVPs'}</button>
          <button className="btn bg-zinc-700 hover:bg-zinc-800" onClick={exportCSV} disabled={!data}>Export CSV</button>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        {data && (
          <div className="mt-6 grid gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Total RSVPs" value={stats.total} />
              <Stat label="Yes" value={stats.yes} />
              <Stat label="No" value={stats.no} />
              <Stat label="Total Guests (Yes)" value={stats.guestsYes} />
            </div>

            <div className="card p-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-zinc-600">
                    <th className="p-2">Name</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Guests</th>
                    <th className="p-2">Message</th>
                    <th className="p-2">Code</th>
                    <th className="p-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(r => (
                    <tr key={r.id} className="border-t border-zinc-200">
                      <td className="p-2">{r.name}</td>
                      <td className="p-2">{r.status}</td>
                      <td className="p-2">{r.guests}</td>
                      <td className="p-2 max-w-[240px] truncate" title={r.message ?? ''}>{r.message}</td>
                      <td className="p-2 font-mono">{r.id}</td>
                      <td className="p-2">{new Date(r.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-4 text-center">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  )
}


