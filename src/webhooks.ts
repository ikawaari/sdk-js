import { createHmac, timingSafeEqual } from 'node:crypto'
import { WebhookSignatureVerificationError } from './errors.js'
import type { WebhookConstructOptions, WebhookSignatureParts } from './types.js'
import type { WebhookEvent } from './resources/types.js'

function toPayloadString(payload: string | Buffer): string {
  return typeof payload === 'string' ? payload : payload.toString('utf8')
}

export function parseSignatureHeader(header: string): WebhookSignatureParts {
  const rawHeader = header.trim()
  if (!rawHeader) {
    throw new WebhookSignatureVerificationError('The Ikawaari-Signature header is empty.')
  }

  const entries = rawHeader.split(',').map((part) => part.trim()).filter(Boolean)
  const values = new Map<string, string[]>()

  for (const entry of entries) {
    const separatorIndex = entry.indexOf('=')
    if (separatorIndex <= 0) {
      continue
    }

    const key = entry.slice(0, separatorIndex)
    const value = entry.slice(separatorIndex + 1)
    const existing = values.get(key) ?? []
    existing.push(value)
    values.set(key, existing)
  }

  const timestamp = Number(values.get('t')?.[0])
  const signatures = values.get('v1') ?? []

  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    throw new WebhookSignatureVerificationError('The Ikawaari-Signature header is missing a valid timestamp.')
  }

  if (signatures.length === 0) {
    throw new WebhookSignatureVerificationError('The Ikawaari-Signature header is missing a v1 signature.')
  }

  return {
    timestamp,
    signatures,
    rawHeader
  }
}

export function verifyWebhookSignature(payload: string | Buffer, header: string, secret: string, options: WebhookConstructOptions = {}): boolean {
  const parts = parseSignatureHeader(header)
  const toleranceSeconds = options.toleranceSeconds ?? 300
  const nowMs = options.nowMs ?? Date.now()
  const ageSeconds = Math.abs(Math.floor(nowMs / 1000) - parts.timestamp)

  if (ageSeconds > toleranceSeconds) {
    return false
  }

  const rawPayload = toPayloadString(payload)
  const signedPayload = `${parts.timestamp}.${rawPayload}`
  const expected = createHmac('sha256', secret).update(signedPayload).digest('hex')
  const expectedBuffer = Buffer.from(expected, 'utf8')

  for (const signature of parts.signatures) {
    const signatureBuffer = Buffer.from(signature, 'utf8')
    if (signatureBuffer.length === expectedBuffer.length && timingSafeEqual(signatureBuffer, expectedBuffer)) {
      return true
    }
  }

  return false
}

export function constructWebhookEvent<T = unknown>(payload: string | Buffer, header: string, secret: string, options: WebhookConstructOptions = {}): WebhookEvent<T> {
  if (!verifyWebhookSignature(payload, header, secret, options)) {
    throw new WebhookSignatureVerificationError('Webhook signature verification failed.')
  }

  const rawPayload = toPayloadString(payload)
  const parsed = JSON.parse(rawPayload) as WebhookEvent<T>

  if (!parsed || typeof parsed !== 'object' || typeof parsed.type !== 'string') {
    throw new WebhookSignatureVerificationError('Webhook payload is not a valid Ikawaari event.')
  }

  return parsed
}

export function parseWebhookEvent<T = unknown>(payload: string | Buffer): WebhookEvent<T> {
  const rawPayload = toPayloadString(payload)
  return JSON.parse(rawPayload) as WebhookEvent<T>
}
