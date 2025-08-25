import { sql } from '@vercel/postgres'
import fs from 'fs/promises'
import path from 'path'

export type RsvpRecord = {
  id: string
  name: string
  status: 'yes' | 'no'
  guests: number
  message: string | null
  created_at: string
  updated_at: string
}

export async function ensureSchema() {
  if (!process.env.POSTGRES_URL) {
    // local dev fallback to JSON file
    const file = getLocalFilePath()
    try {
      await fs.access(file)
    } catch {
      await fs.writeFile(file, JSON.stringify([]), 'utf8')
    }
    return
  }
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('yes','no')),
      guests INT NOT NULL DEFAULT 1,
      message TEXT,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_rsvps_name ON rsvps (name);
  `
}

export async function createOrUpdateRsvp(
  id: string,
  name: string,
  status: 'yes' | 'no',
  guests: number,
  message: string | null
) {
  if (!process.env.POSTGRES_URL) {
    const all = await readLocal()
    const now = new Date().toISOString()
    const idx = all.findIndex(r => r.id === id)
    const rec: RsvpRecord = idx >= 0
      ? { ...all[idx], name, status, guests, message, updated_at: now }
      : { id, name, status, guests, message, created_at: now, updated_at: now }
    if (idx >= 0) all[idx] = rec; else all.push(rec)
    await writeLocal(all)
    return rec
  }
  const result = await sql<RsvpRecord>`
    INSERT INTO rsvps (id, name, status, guests, message)
    VALUES (${id}, ${name}, ${status}, ${guests}, ${message})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      status = EXCLUDED.status,
      guests = EXCLUDED.guests,
      message = EXCLUDED.message,
      updated_at = NOW()
    RETURNING *;
  `
  return result.rows[0]
}

export async function getRsvpById(id: string) {
  if (!process.env.POSTGRES_URL) {
    const all = await readLocal()
    return all.find(r => r.id === id) ?? null
  }
  const result = await sql<RsvpRecord>`SELECT * FROM rsvps WHERE id = ${id} LIMIT 1;`
  return result.rows[0] ?? null
}

export async function listRsvps() {
  if (!process.env.POSTGRES_URL) {
    const all = await readLocal()
    return all.sort((a, b) => b.created_at.localeCompare(a.created_at))
  }
  const result = await sql<RsvpRecord>`SELECT * FROM rsvps ORDER BY created_at DESC;`
  return result.rows
}

function getLocalFilePath() {
  return path.join(process.cwd(), 'rsvps.local.json')
}

async function readLocal(): Promise<RsvpRecord[]> {
  const file = getLocalFilePath()
  try {
    const txt = await fs.readFile(file, 'utf8')
    return JSON.parse(txt) as RsvpRecord[]
  } catch {
    return []
  }
}

async function writeLocal(rows: RsvpRecord[]) {
  const file = getLocalFilePath()
  await fs.writeFile(file, JSON.stringify(rows, null, 2), 'utf8')
}


