"use client"
import { useEffect, useState } from 'react'
import Lightbox, { type LightboxItem } from './Lightbox'

type MediaItem = { url: string; type: 'image' | 'video'; name: string }

export default function Gallery() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [openAt, setOpenAt] = useState<number | null>(null)
  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/media')
        const data = await res.json()
        if (Array.isArray(data.items)) setItems(data.items)
      } catch {}
    })()
  }, [])
  if (!items.length) return <p className="text-sm text-zinc-500">Add photos/videos to <span className="font-mono">public/media</span>.</p>
  return (
    <>
      <div className="grid grid-cols-2 gap-3" onContextMenu={(e) => e.preventDefault()}>
        {items.map((it, idx) => (
          <button key={it.url} className="card overflow-hidden select-none" onClick={() => setOpenAt(idx)}>
            {it.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={it.url} alt={it.name} className="w-full h-40 object-cover pointer-events-none" draggable={false} />
            ) : (
              <video playsInline muted className="w-full h-40 object-cover" onContextMenu={(e) => e.preventDefault()}>
                <source src={it.url} />
              </video>
            )}
          </button>
        ))}
      </div>
      {openAt != null && (
        <Lightbox
          items={items as LightboxItem[]}
          startIndex={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  )
}


