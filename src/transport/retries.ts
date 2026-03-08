import type { HttpMethod } from '../types.js'

const RETRYABLE_STATUS_CODES = new Set([409, 429, 500, 502, 503, 504])

export function canRetry(method: HttpMethod, idempotencyKey?: string): boolean {
  return method === 'GET' || Boolean(idempotencyKey)
}

export function shouldRetryStatus(status: number): boolean {
  return RETRYABLE_STATUS_CODES.has(status)
}

export function parseRetryAfterSeconds(value: string | null): number | undefined {
  if (!value) {
    return undefined
  }

  const asNumber = Number(value)
  if (Number.isFinite(asNumber) && asNumber >= 0) {
    return asNumber
  }

  const asDate = Date.parse(value)
  if (!Number.isNaN(asDate)) {
    return Math.max(0, Math.ceil((asDate - Date.now()) / 1000))
  }

  return undefined
}

export function computeRetryDelayMs(attempt: number, retryAfterSeconds?: number): number {
  if (typeof retryAfterSeconds === 'number') {
    return retryAfterSeconds * 1000
  }

  const exponential = Math.min(500 * (2 ** attempt), 5_000)
  const jitter = Math.floor(Math.random() * 250)
  return exponential + jitter
}

export async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
