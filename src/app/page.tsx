import ConfettiBG from '@/components/ConfettiBG'
import Garland from '@/components/Garland'
import Countdown from '@/components/Countdown'
import Parade from '@/components/Parade'
import StarsBG from '@/components/StarsBG'
import BalloonsSVG from '@/components/BalloonsSVG'
import PrincessSVG from '@/components/PrincessSVG'
import HeaderWave from '@/components/HeaderWave'
import BackgroundMedia from '@/components/BackgroundMedia'
import HeroMediaBlob from '@/components/HeroMediaBlob'
import BalloonCluster from '@/components/BalloonCluster'
import InteractionsLayer from '@/components/InteractionsLayer'
import FloatingAnimals from '@/components/FloatingAnimals'
import Link from 'next/link'

export default function Home() {
  // Sept 2 at 7:00 PM in New York (EST/EDT). On Sep 2 it's typically EDT (UTC-4) → 23:00Z
  const now = new Date()
  const currentYear = now.getFullYear()
  const baseUtc = Date.UTC(currentYear, 8, 2, 23, 0, 0)
  const targetUtc = baseUtc <= now.getTime() ? Date.UTC(currentYear + 1, 8, 2, 23, 0, 0) : baseUtc
  const eventISO = new Date(targetUtc).toISOString()
  return (
    <main className="relative min-h-screen p-6">
      <BackgroundMedia />
      <ConfettiBG />
      <StarsBG />
      <BalloonsSVG />
      <HeaderWave />
      <PrincessSVG />
      <InteractionsLayer />
      <FloatingAnimals />
      <section className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center mt-20">
        <div className="card p-8 order-2 lg:order-1">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-700 leading-tight">
            Aarvi turns 4! 🎉
          </h1>
          <p className="mt-3 text-zinc-700 text-lg">
            Come celebrate with cake, games, and lots of giggles. We can’t wait to see you!
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="card p-4 text-center">
              <div className="text-sm text-zinc-500">Date</div>
              <div className="text-lg font-semibold">Sep 2</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-zinc-500">Time</div>
              <div className="text-lg font-semibold">7:00 PM EST</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-zinc-500">Venue</div>
              <div className="text-lg font-semibold">Aarvi's Residence, 366 Upper Gage Ave, Hamilton L8V 4H7</div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Aarvi%27s%20Residence%2C%20366%20Upper%20Gage%20Ave%2C%20Hamilton%20L8V%204H7"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center justify-center text-sm text-brand-700 underline"
              >
                Get Directions ↗
              </a>
            </div>
            <div className="card p-4 text-center">
              <div className="text-sm text-zinc-500">Theme</div>
              <div className="text-lg font-semibold">Rainbow & Unicorns 🦄</div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href="/rsvp" className="btn">RSVP Now</Link>
            <Link href="/admin" className="btn bg-zinc-700 hover:bg-zinc-800">Host Dashboard</Link>
          </div>
          <p className="mt-3 text-sm text-zinc-500">Update anytime using your RSVP code.</p>
        </div>
        <div className="grid gap-6 order-1 lg:order-2">
          <HeroMediaBlob />
          <div className="card p-6">
            <h2 className="text-xl font-bold text-brand-700">Countdown to Party</h2>
            <p className="text-sm text-zinc-600">We’re getting excited!</p>
            <div className="mt-4">
              <Countdown date={eventISO} />
            </div>
          </div>
        </div>
      </section>
      <BalloonCluster />
      <Parade />
    </main>
  )
}


