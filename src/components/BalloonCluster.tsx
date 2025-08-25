"use client"
import { useMemo } from 'react'

type Balloon = { x: number; y: number; color: string; id: string }

export default function BalloonCluster() {
  const balloons = useMemo<Balloon[]>(() => {
    const colors = ['#fda4af','#93c5fd','#86efac','#fdba74','#f9a8d4']
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `b${i}`,
      x: 8 + i * 11 + (i % 2 === 0 ? 3 : -3),
      y: 86 + (i % 2 === 0 ? 0 : 2),
      color: colors[i % colors.length],
    }))
  }, [])

  const pop = (e: React.MouseEvent<SVGCircleElement>) => {
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    const held = 0.5
    const ev = new CustomEvent('confetti-burst', { detail: { x, y, power: held } })
    window.dispatchEvent(ev)
  }

  return (
    <svg className="absolute inset-x-0 bottom-0 h-44 w-full -z-10" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      {balloons.map((b, i) => (
        <g key={b.id} className={`${i % 2 ? 'float-y' : 'float-y-slow'} float-x cursor-pointer`}>
          <defs>
            <radialGradient id={`g${b.id}`} cx="30%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
              <stop offset="100%" stopColor={b.color} stopOpacity="0.95"/>
            </radialGradient>
          </defs>
          <line x1={b.x} y1={b.y + 6} x2={b.x} y2={100} stroke="rgba(0,0,0,0.15)" strokeWidth={0.3} />
          <path d={`M ${b.x} ${b.y-5} C ${b.x-4} ${b.y-1}, ${b.x-4} ${b.y+3}, ${b.x} ${b.y+4} C ${b.x+4} ${b.y+3}, ${b.x+4} ${b.y-1}, ${b.x} ${b.y-5} Z`} fill={`url(#g${b.id})`} onClick={pop} />
          <circle cx={b.x+0.6} cy={b.y-1.5} r={0.6} fill="#fff" fillOpacity="0.85" />
        </g>
      ))}
    </svg>
  )
}


