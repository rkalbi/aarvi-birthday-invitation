"use client"
import { useEffect, useState } from 'react'

type MediaItem = { url: string; type: 'image' | 'video'; name: string }

export default function BackgroundMedia() {
  const [items, setItems] = useState<MediaItem[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/media')
        const data = await res.json()
        if (Array.isArray(data.items)) setItems(data.items)
      } catch {}
    })()
  }, [])

  const tiles = items.slice(0, 6)
  if (tiles.length === 0) return null

  return (
    <div className="absolute inset-0 pointer-events-none select-none" style={{ zIndex: -30 }} onContextMenu={(e) => e.preventDefault()}>
      <div className="h-full w-full grid grid-cols-3 grid-rows-2 gap-1 opacity-30">
        {tiles.map((it, i) => (
          <div key={i} className="relative overflow-hidden">
            {it.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.url} alt={it.name} className="h-full w-full object-cover scale-110 animate-kenburns" draggable={false} />
            ) : (
              <video className="h-full w-full object-cover scale-110 animate-kenburns" autoPlay loop muted playsInline>
                <source src={it.url} />
              </video>
            )}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/60" />
    </div>
  )
}


