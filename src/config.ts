import type { ClientOptions, IkawaariEnvironment } from './types.js'

export interface ResolvedClientOptions {
  apiKey?: string
  appToken?: string
  merchantToken?: string
  baseUrl: string
  environment: IkawaariEnvironment
  timeoutMs: number
  maxNetworkRetries: number
  headers: Record<string, string>
  userAgent: string
  fetch: typeof fetch
}

export function normalizeBaseUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim()
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

export function resolveClientOptions(options: ClientOptions): ResolvedClientOptions {
  if (!options.baseUrl || !options.baseUrl.trim()) {
    throw new Error('Ikawaari baseUrl is required.')
  }

  const fetchImpl = options.fetch ?? globalThis.fetch?.bind(globalThis)
  if (!fetchImpl) {
    throw new Error('Global fetch is not available. Provide a fetch implementation in the client options.')
  }

  return {
    apiKey: options.apiKey,
    appToken: options.appToken,
    merchantToken: options.merchantToken,
    baseUrl: normalizeBaseUrl(options.baseUrl),
    environment: options.environment ?? 'sandbox',
    timeoutMs: options.timeoutMs ?? 30_000,
    maxNetworkRetries: options.maxNetworkRetries ?? 2,
    headers: { ...(options.headers ?? {}) },
    userAgent: options.userAgent ?? '@ikawaari/sdk/0.1.0',
    fetch: fetchImpl
  }
}
