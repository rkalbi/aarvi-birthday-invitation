export default function Parade() {
  const colors = ['#fda4af', '#f9a8d4', '#93c5fd', '#fdba74', '#86efac']
  return (
    <div className="pointer-events-none select-none absolute inset-x-0 bottom-2 -z-0">
      <div className="relative overflow-hidden">
        <div className="whitespace-nowrap will-change-transform parade inline-flex items-center gap-6">
          {Array.from({ length: 40 }).map((_, i) => (
            <svg key={i} width="38" height="38" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M2 13h20" stroke={colors[i % colors.length]} strokeWidth="2" strokeDasharray="2 4"/>
              <circle cx="6" cy="6" r="2" fill={colors[(i+1) % colors.length]} />
              <circle cx="18" cy="18" r="2" fill={colors[(i+2) % colors.length]} />
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}


