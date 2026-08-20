import { NextResponse } from "next/server"

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 20
const requestBuckets = new Map<string, { count: number; resetAt: number }>()

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  return realIp || forwardedFor?.split(",")[0]?.trim() || "unknown"
}

export function enforceRateLimit(request: Request) {
  const now = Date.now()
  const key = getClientKey(request)
  const current = requestBuckets.get(key)
  const bucket = !current || current.resetAt <= now ? { count: 0, resetAt: now + WINDOW_MS } : current

  bucket.count += 1
  requestBuckets.set(key, bucket)

  if (requestBuckets.size > 10_000) {
    for (const [bucketKey, value] of requestBuckets) {
      if (value.resetAt <= now) requestBuckets.delete(bucketKey)
    }
  }

  if (bucket.count > MAX_REQUESTS_PER_WINDOW) {
    return NextResponse.json(
      { error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((bucket.resetAt - now) / 1000)) },
      },
    )
  }

  return null
}
