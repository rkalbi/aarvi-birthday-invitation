export default function Garland() {
  return (
    <svg className="absolute top-0 left-0 w-full h-40 -z-10" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden>
      <path d="M0 40 Q 300 120 600 40 T 1200 40" fill="none" stroke="#fda4af" strokeWidth="6" />
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (i + 1) * (1200 / 21)
        const y = 40 + (i % 2 === 0 ? 40 : 80)
        const hue = (i * 18) % 360
        return <g key={i}>
          <line x1={x} y1={40} x2={x} y2={y} stroke="#fda4af" strokeWidth="4" />
          <circle cx={x} cy={y} r="14" fill={`hsl(${hue}, 85%, 60%)`} />
        </g>
      })}
    </svg>
  )
}


