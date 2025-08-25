"use client"
import { useRef } from 'react'

export default function BalloonsSVG() {
  const colors = ['#fda4af', '#93c5fd', '#86efac', '#fdba74', '#f9a8d4']
  const downAtMs = useRef<number | null>(null)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    downAtMs.current = Date.now()
    lastPoint.current = { x: e.clientX, y: e.clientY }
  }
  const onPointerUp = () => {
    const start = downAtMs.current
    const pt = lastPoint.current
    downAtMs.current = null
    if (!start || !pt) return
    const held = (Date.now() - start) / 1000
    const power = Math.max(0.1, Math.min(held / 1.5, 1))
    const ev = new CustomEvent('confetti-burst', { detail: { x: pt.x, y: pt.y, power } })
    window.dispatchEvent(ev)
  }
  return (
    <svg onPointerDown={onPointerDown} onPointerUp={onPointerUp} className="absolute inset-0 -z-10 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => {
        const cx = (i * 10 + 10) % 100
        const delay = (i * 0.7) % 5
        const color = colors[i % colors.length]
        return (
          <g key={i} className="balloon-float cursor-pointer">
            <line x1={cx} y1={110} x2={cx} y2={85} stroke="rgba(0,0,0,0.15)" strokeWidth={0.3} />
            <ellipse cx={cx} cy={82} rx={3.5} ry={4.5} fill={color} opacity="0.9" />
          </g>
        )
      })}
    </svg>
  )
}


