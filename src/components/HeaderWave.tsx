export default function HeaderWave() {
  return (
    <div className="absolute inset-x-0 top-0 -z-10">
      <svg viewBox="0 0 1440 240" className="w-full h-40" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fda4af"/>
            <stop offset="50%" stopColor="#fbcfe8"/>
            <stop offset="100%" stopColor="#93c5fd"/>
          </linearGradient>
        </defs>
        <path d="M0,160 C240,220 360,40 600,90 C840,140 960,220 1200,160 C1320,130 1380,120 1440,140 L1440,0 L0,0 Z" fill="url(#g1)" fillOpacity="0.55"/>
        <path d="M0,200 C260,120 400,200 660,160 C920,120 1100,220 1440,180 L1440,0 L0,0 Z" fill="url(#g1)" fillOpacity="0.35"/>
      </svg>
      <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center gap-6">
        <svg width="28" height="28" viewBox="0 0 24 24" className="bob" aria-hidden>
          <path d="M6 18h12v2H6z" fill="#fda4af"/>
          <path d="M8 18V9h8v9z" fill="#fecdd3"/>
          <circle cx="12" cy="7" r="1" fill="#f59e0b"/>
        </svg>
        <svg width="28" height="28" viewBox="0 0 24 24" className="bob delay-200" aria-hidden>
          <polygon points="12,2 9,9 15,9" fill="#fbbf24"/>
          <rect x="10" y="9" width="4" height="2" fill="#fcd34d"/>
        </svg>
        <svg width="28" height="28" viewBox="0 0 24 24" className="bob delay-300" aria-hidden>
          <circle cx="12" cy="8" r="6" fill="#a78bfa"/>
          <polygon points="12,2 10,8 14,8" fill="#f0abfc"/>
        </svg>
        <svg width="28" height="28" viewBox="0 0 24 24" className="bob delay-500" aria-hidden>
          <ellipse cx="12" cy="10" rx="6" ry="8" fill="#93c5fd"/>
          <rect x="11.5" y="18" width="1" height="4" fill="#64748b"/>
        </svg>
        <svg width="28" height="28" viewBox="0 0 24 24" className="bob delay-700" aria-hidden>
          <circle cx="12" cy="12" r="2" fill="#fde68a"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M19.1 4.9l-2.8 2.8M6.9 16.3l-2.8 2.8" stroke="#fde68a"/>
        </svg>
      </div>
    </div>
  )
}


