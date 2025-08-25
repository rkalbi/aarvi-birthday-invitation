"use client"
import { useEffect, useRef } from 'react'

export default function StarsBG() {
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

    const flash = () => {
      // spawn new stars burst
      for (let i = 0; i < 20; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.3,
          t: Math.random() * Math.PI * 2,
          s: 0.02 + Math.random() * 0.03,
        })
      }
    }
    const onClick = (e: MouseEvent) => {
      // small flash overlay
      if (!canvas) return
      const ctx2 = ctx
      ctx2.save()
      ctx2.fillStyle = 'rgba(255,255,255,0.2)'
      ctx2.fillRect(0, 0, width, height)
      setTimeout(() => ctx2.restore(), 80)
      flash()
    }
    canvas.addEventListener('click', onClick)

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.3,
      t: Math.random() * Math.PI * 2,
      s: 0.02 + Math.random() * 0.03,
    }))

    let raf = 0
    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const st of stars) {
        st.t += st.s
        const alpha = 0.4 + Math.abs(Math.sin(st.t)) * 0.6
        ctx.beginPath()
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={ref} className="absolute inset-0 -z-20 h-full w-full" />
}


