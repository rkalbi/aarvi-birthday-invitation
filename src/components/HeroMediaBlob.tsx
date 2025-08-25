"use client"
import { useEffect, useRef, useState } from 'react'

type MediaItem = { url: string; type: 'image' | 'video'; name: string }

export default function HeroMediaBlob() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [idx, setIdx] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/media')
        const data = await res.json()
        if (Array.isArray(data.items)) setItems(data.items)
      } catch {}
    })()
  }, [])

  useEffect(() => {
    if (items.length === 0) return
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 4000)
    return () => clearInterval(t)
  }, [items.length])

  function burst(e: React.MouseEvent) {
    const ev = new CustomEvent('confetti-burst', { detail: { x: e.clientX, y: e.clientY, power: 0.6 } })
    window.dispatchEvent(ev)
  }

  if (items.length === 0) return null
  const current = items[idx]

  return (
    <div ref={ref} className="relative aspect-square max-w-md mx-auto w-full">
      <button onClick={burst} className="absolute inset-0 w-full h-full rounded-[40%] overflow-hidden blob ring-4 ring-white/50 shadow-xl">
        {current.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.url} alt={current.name} className="w-full h-full object-cover" draggable={false} />
        ) : (
          <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src={current.url} />
          </video>
        )}
      </button>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20" />
    </div>
  )
}


