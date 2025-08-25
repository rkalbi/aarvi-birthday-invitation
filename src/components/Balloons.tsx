"use client"
import { useEffect, useRef } from 'react'

export default function Balloons() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    const onResize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    window.addEventListener('resize', onResize)

    const balloons = Array.from({ length: 14 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * height,
      r: 18 + Math.random() * 14,
      hue: Math.floor(Math.random() * 360),
      speed: 0.4 + Math.random() * 0.6,
      sway: Math.random() * 1.5 + 0.5,
    }))

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const b of balloons) {
        b.y -= b.speed
        b.x += Math.sin(b.y / 30) * b.sway
        if (b.y < -30) {
          b.y = height + 30
          b.x = Math.random() * width
        }
        // string
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,0,0.15)'
        ctx.moveTo(b.x, b.y + b.r)
        ctx.lineTo(b.x, b.y + b.r + 30)
        ctx.stroke()
        // balloon
        const grd = ctx.createRadialGradient(b.x - 5, b.y - 5, b.r * 0.2, b.x, b.y, b.r)
        grd.addColorStop(0, `hsla(${b.hue},90%,65%,0.95)`)
        grd.addColorStop(1, `hsla(${b.hue},90%,55%,0.8)`)
        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.ellipse(b.x, b.y, b.r * 0.85, b.r, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 -z-10 h-full w-full" />
}


