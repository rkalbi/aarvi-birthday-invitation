"use client"
import { useEffect, useRef } from 'react'

export default function ConfettiBG() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', onResize)

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 2,
      s: Math.random() * 1.5 + 0.5,
      hue: Math.floor(Math.random() * 360),
    }))

    type Burst = { x: number; y: number; vx: number; vy: number; r: number; hue: number; life: number }
    const bursts: Burst[] = []

    function addBurst(cx: number, cy: number, power = 0.5) {
      const count = Math.floor(40 + power * 80)
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2
        const speed = 1.5 + Math.random() * (3 + power * 3)
        bursts.push({ x: cx, y: cy, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed - 1, r: 2 + Math.random() * 2.5, hue: Math.floor(Math.random() * 360), life: 70 + Math.floor(power * 40) })
      }
    }

    const onBurst = (e: Event) => {
      const any = e as CustomEvent<{ x: number; y: number; power?: number }>
      const rect = canvas.getBoundingClientRect()
      const cx = (any.detail?.x ?? rect.left + rect.width / 2) - rect.left
      const cy = (any.detail?.y ?? rect.top + rect.height / 2) - rect.top
      const power = any.detail?.power ?? 0.5
      addBurst(cx, cy, power)
    }
    window.addEventListener('confetti-burst', onBurst as EventListener)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.fillStyle = `hsl(${p.hue}, 80%, 60%)`
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
        p.y += p.s
        p.x += Math.sin(p.y / 20) * 0.6
        if (p.y > height + 10) {
          p.y = -10
          p.x = Math.random() * width
        }
      }

      // bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        ctx.beginPath()
        ctx.fillStyle = `hsl(${b.hue},85%,60%)`
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
        b.x += b.vx
        b.y += b.vy
        b.vy += 0.06 // gravity
        b.vx *= 0.99
        b.vy *= 0.99
        b.life -= 1
        if (b.life <= 0) bursts.splice(i, 1)
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('confetti-burst', onBurst as EventListener)
    }
  }, [])

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <canvas ref={ref} className="h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 to-white/10" />
    </div>
  )
}


