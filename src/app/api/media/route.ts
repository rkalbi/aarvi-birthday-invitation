import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif'])
const VIDEO_EXT = new Set(['.mp4', '.mov', '.webm'])

export async function GET(req: NextRequest) {
  try {
    const mediaDir = path.join(process.cwd(), 'public', 'media')
    const url = new URL(req.url)
    const name = url.searchParams.get('name')
    if (name) {
      // Proxy single file without exposing direct URL (best-effort; cannot fully prevent saving)
      const safe = path.basename(name)
      const filePath = path.join(mediaDir, safe)
      const data = await fs.readFile(filePath)
      const ext = path.extname(safe).toLowerCase()
      const type = IMAGE_EXT.has(ext)
        ? (ext === '.gif' ? 'image/gif' : ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg')
        : (ext === '.webm' ? 'video/webm' : 'video/mp4')
      const body = new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
      return new Response(body, { headers: { 'Content-Type': type, 'Cache-Control': 'no-store' } })
    }
    let entries: string[] = []
    try {
      entries = await fs.readdir(mediaDir)
    } catch {
      return NextResponse.json({ items: [] })
    }
    const items = entries
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()) || VIDEO_EXT.has(path.extname(f).toLowerCase()))
      .map((f) => {
        const ext = path.extname(f).toLowerCase()
        const type = IMAGE_EXT.has(ext) ? 'image' : 'video'
        return { url: `/api/media?name=${encodeURIComponent(f)}`, type, name: f }
      })
    return NextResponse.json({ items })
  } catch (e) {
    return NextResponse.json({ items: [], error: 'failed' }, { status: 500 })
  }
}


