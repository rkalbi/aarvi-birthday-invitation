"use client"
import { useEffect, useState } from 'react'

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const diff = Math.max(0, target - (now ?? target))
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  const s = Math.floor((diff / 1000) % 60)

  return (
    <div className="grid grid-flow-col gap-3 text-center auto-cols-fr" suppressHydrationWarning>
      <Time value={now === null ? 0 : d} label="Days" />
      <Time value={now === null ? 0 : h} label="Hours" />
      <Time value={now === null ? 0 : m} label="Minutes" />
      <Time value={now === null ? 0 : s} label="Seconds" />
    </div>
  )
}

function Time({ value, label }: { value: number; label: string }) {
  return (
    <div className="card p-3">
      <div className="text-3xl font-extrabold text-brand-700" suppressHydrationWarning>{value.toString().padStart(2, '0')}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  )
}


