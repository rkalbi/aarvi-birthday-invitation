type Hit = { ts: number }
const buckets = new Map<string, Hit[]>()

export function getClientId(headers: Headers) {
  const xf = headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = xf || headers.get('x-real-ip') || 'anon'
  return ip
}

export function rateLimit(id: string, limit: number, windowMs: number) {
  const now = Date.now()
  const arr = buckets.get(id) || []
  // prune old
  while (arr.length && now - arr[0].ts > windowMs) arr.shift()
  if (arr.length >= limit) return false
  arr.push({ ts: now })
  buckets.set(id, arr)
  return true
}


