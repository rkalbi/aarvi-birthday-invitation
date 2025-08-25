"use client"
import { useEffect, useState } from 'react'

type Animal = { id: number; x: number; y: number; type: 'bunny' | 'lion' | 'panda' | 'unicorn' }

function SVGAnimal({ type }: { type: Animal['type'] }) {
  if (type === 'bunny') return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
      <ellipse cx="12" cy="14" rx="6" ry="5" fill="#fde68a"/>
      <ellipse cx="9" cy="6" rx="2" ry="4" fill="#fef3c7"/>
      <ellipse cx="15" cy="6" rx="2" ry="4" fill="#fef3c7"/>
      <circle cx="10" cy="14" r="1" fill="#0f172a"/>
      <circle cx="14" cy="14" r="1" fill="#0f172a"/>
    </svg>
  )
  if (type === 'lion') return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="5" fill="#fbbf24"/>
      <circle cx="12" cy="12" r="7" fill="none" stroke="#f59e0b" strokeWidth="3"/>
    </svg>
  )
  if (type === 'panda') return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="6" fill="#fff"/>
      <circle cx="9" cy="10" r="2" fill="#111827"/>
      <circle cx="15" cy="10" r="2" fill="#111827"/>
    </svg>
  )
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="6" fill="#e9d5ff"/>
      <polygon points="12,2 10,8 14,8" fill="#a78bfa"/>
    </svg>
  )
}

export default function FloatingAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([])
  useEffect(() => {
    let id = 1
    const onSpawn = (e: Event) => {
      const any = e as CustomEvent<{ x: number; y: number; type: Animal['type'] }>
      setAnimals((arr) => arr.concat({ id: id++, x: any.detail?.x ?? 0, y: any.detail?.y ?? 0, type: any.detail?.type ?? 'bunny' }))
      setTimeout(() => setAnimals((arr) => arr.slice(1)), 4000)
    }
    window.addEventListener('animal-spawn', onSpawn as EventListener)
    return () => window.removeEventListener('animal-spawn', onSpawn as EventListener)
  }, [])
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {animals.map((a) => (
        <div key={a.id} className="absolute animate-floatAnimal" style={{ left: a.x, top: a.y }}>
          <SVGAnimal type={a.type} />
        </div>
      ))}
    </div>
  )
}


