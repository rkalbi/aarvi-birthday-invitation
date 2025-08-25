import './globals.css'
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'

const bodyFont = Nunito({ subsets: ['latin'], weight: ['400', '600', '800'] })

export const metadata: Metadata = {
  title: "Aarvi's 4th Birthday!",
  description: 'Join us for a magical celebration and RSVP online',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${bodyFont.className} min-h-screen antialiased text-zinc-800`}>
        {children}
      </body>
    </html>
  )
}


