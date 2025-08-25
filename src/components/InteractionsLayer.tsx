"use client"
import { useEffect, useRef } from 'react'

export default function InteractionsLayer() {
  const downAt = useRef<number | null>(null)
  const point = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      // Ignore clicks on inputs/buttons/cards
      const el = e.target as HTMLElement
      if (el.closest('button, a, input, textarea, select, .card')) return
      downAt.current = Date.now()
      point.current = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => {
      downAt.current = null
    }
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement
      if (el.closest('button, a, input, textarea, select, .card')) return
      const pt = point.current || { x: e.clientX, y: e.clientY }
      const held = downAt.current ? (Date.now() - downAt.current) / 1000 : 0
      const power = Math.max(0.2, Math.min(held / 1.5, 1))
      const dice = Math.random()
      if (dice < 0.6) {
        // Confetti burst
        window.dispatchEvent(new CustomEvent('confetti-burst', { detail: { x: pt.x, y: pt.y, power } }))
      } else if (dice < 0.82) {
        // Mini fireworks: chained bursts
        const n = 3 + Math.floor(Math.random() * 3)
        for (let i = 0; i < n; i++) {
          setTimeout(() => {
            const jitterX = pt.x + (Math.random() - 0.5) * 80
            const jitterY = pt.y + (Math.random() - 0.5) * 60
            window.dispatchEvent(new CustomEvent('confetti-burst', { detail: { x: jitterX, y: jitterY, power: 0.5 + Math.random() * power } }))
          }, i * 120)
        }
      } else {
        // Spawn a floating animal
        const animals = ['bunny','lion','panda','unicorn'] as const
        const type = animals[Math.floor(Math.random() * animals.length)]
        window.dispatchEvent(new CustomEvent('animal-spawn', { detail: { x: pt.x, y: pt.y, type } }))
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('pointerup', onUp)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}


