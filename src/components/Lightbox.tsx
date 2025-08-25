"use client"
import { useEffect, useRef, useState } from 'react'

export type LightboxItem = { url: string; type: 'image' | 'video'; name: string }

export default function Lightbox({ items, startIndex, onClose }: { items: LightboxItem[]; startIndex: number; onClose: () => void }) {
  const [index, setIndex] = useState(startIndex)
  const startX = useRef<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function next() { setIndex((i) => (i + 1) % items.length) }
  function prev() { setIndex((i) => (i - 1 + items.length) % items.length) }

  function onTouchStart(e: React.TouchEvent) { startX.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current == null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if (Math.abs(dx) > 40) {
      if (dx < 0) next(); else prev()
    }
    startX.current = null
  }

  const it = items[index]
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center" onClick={onClose} onContextMenu={(e) => e.preventDefault()}>
      <button aria-label="Close" className="absolute top-4 right-4 btn bg-zinc-800 hover:bg-zinc-700" onClick={onClose}>Close</button>
      <button aria-label="Prev" className="absolute left-4 top-1/2 -translate-y-1/2 btn bg-zinc-800 hover:bg-zinc-700" onClick={(e) => { e.stopPropagation(); prev() }}>&larr;</button>
      <button aria-label="Next" className="absolute right-4 top-1/2 -translate-y-1/2 btn bg-zinc-800 hover:bg-zinc-700" onClick={(e) => { e.stopPropagation(); next() }}>&rarr;</button>
      <div className="max-w-5xl w-full px-4" onClick={(e) => e.stopPropagation()} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {it.type === 'image' ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={it.url} alt={it.name} className="mx-auto max-h-[80vh] w-auto select-none" draggable={false} />
        ) : (
          <video className="mx-auto max-h-[80vh] w-auto" controls playsInline onContextMenu={(e) => e.preventDefault()}>
            <source src={it.url} />
          </video>
        )}
        <div className="mt-2 text-center text-white/80 text-sm">Swipe or use arrows. Press Esc to close.</div>
      </div>
    </div>
  )
}


