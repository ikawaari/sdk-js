import { createConnectionError, createCredentialError, createIkawaariError, createTimeoutError } from '../errors.js'
import type { ResolvedClientOptions } from '../config.js'
import type { ApiResponse, AuthMode, HttpMethod, QueryParams, RequestOptions } from '../types.js'
import { canRetry, computeRetryDelayMs, parseRetryAfterSeconds, shouldRetryStatus, sleep } from './retries.js'

interface ExecuteRequestArgs {
  clientOptions: ResolvedClientOptions
  method: HttpMethod
  path: string
  body?: unknown
  options?: RequestOptions
}

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function buildUrl(baseUrl: string, path: string, query?: QueryParams): string {
  const url = new URL(`${baseUrl}${normalizePath(path)}`)

  if (!query) {
    return url.toString()
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null) {
      continue
    }

    if (Array.isArray(rawValue)) {
      for (const item of rawValue) {
        if (item !== undefined && item !== null) {
          url.searchParams.append(key, String(item))
        }
      }
      continue
    }

    url.searchParams.set(key, String(rawValue))
  }

  return url.toString()
}

function resolveAuthHeader(authMode: AuthMode | undefined, clientOptions: ResolvedClientOptions): string | undefined {
  const mode = authMode ?? (clientOptions.apiKey ? 'apiKey' : clientOptions.appToken ? 'appToken' : clientOptions.merchantToken ? 'merchantJwt' : 'apiKey')

  if (mode === 'none') {
    return undefined
  }

  if (mode === 'appToken') {
    if (!clientOptions.appToken) {
      throw createCredentialError('No Ikawaari app token was provided.')
    }

    return `Bearer ${clientOptions.appToken}`
  }

  if (mode === 'merchantJwt') {
    if (!clientOptions.merchantToken) {
      throw createCredentialError('No Ikawaari merchant token was provided.')
    }

    return `Bearer ${clientOptions.merchantToken}`
  }

  if (!clientOptions.apiKey) {
    throw createCredentialError('No Ikawaari API key was provided.')
  }

  return `Bearer ${clientOptions.apiKey}`
}

function isJsonResponse(contentType: string | null): boolean {
  return Boolean(contentType && contentType.toLowerCase().includes('json'))
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return {}
  }

  if (isJsonResponse(response.headers.get('content-type'))) {
    return response.json()
  }

  return response.text()
}

function createAbortSignal(timeoutMs: number, externalSignal?: AbortSignal): {
  signal: AbortSignal
  cleanup: () => void
  didTimeout: () => boolean
} {
  const controller = new AbortController()
  let timedOut = false
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let abortHandler: (() => void) | undefined

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason)
    } else {
      abortHandler = () => controller.abort(externalSignal.reason)
      externalSignal.addEventListener('abort', abortHandler, { once: true })
    }
  }

  timeoutId = setTimeout(() => {
    timedOut = true
    controller.abort(new Error(`Ikawaari request timed out after ${timeoutMs}ms.`))
  }, timeoutMs)

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (externalSignal && abortHandler) {
        externalSignal.removeEventListener('abort', abortHandler)
      }
    },
    didTimeout: () => timedOut
  }
}

export async function executeRequest<T>({ clientOptions, method, path, body, options }: ExecuteRequestArgs): Promise<ApiResponse<T>> {
  const maxRetries = clientOptions.maxNetworkRetries
  const idempotencyKey = options?.idempotencyKey
  const url = buildUrl(clientOptions.baseUrl, path, options?.query)

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const headers = new Headers(clientOptions.headers)
    headers.set('Accept', 'application/json')
    headers.set('Content-Type', 'application/json')
    headers.set('User-Agent', clientOptions.userAgent)

    const authHeader = resolveAuthHeader(options?.authMode, clientOptions)
    if (authHeader) {
      headers.set('Authorization', authHeader)
    }

    if (idempotencyKey && method !== 'GET') {
      headers.set('Idempotency-Key', idempotencyKey)
    }

    if (options?.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        headers.set(key, value)
      }
    }

    const abortState = createAbortSignal(options?.timeoutMs ?? clientOptions.timeoutMs, options?.signal)

    try {
      const response = await clientOptions.fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: abortState.signal
      })

      abortState.cleanup()

      const raw = await parseResponseBody(response)
      const requestId = response.headers.get('Ikawaari-Request-Id') ?? response.headers.get('ikawaari-request-id') ?? undefined
      const retryAfterSeconds = parseRetryAfterSeconds(response.headers.get('Retry-After'))

      if (!response.ok) {
        const error = createIkawaariError(raw, response.status, requestId, retryAfterSeconds)
        if (attempt < maxRetries && canRetry(method, idempotencyKey) && shouldRetryStatus(response.status)) {
          await sleep(computeRetryDelayMs(attempt, retryAfterSeconds))
          continue
        }

        throw error
      }

      return {
        data: raw as T,
        status: response.status,
        requestId,
        headers: response.headers,
        raw
      }
    } catch (error) {
      abortState.cleanup()

      if (error instanceof Error && error.name === 'AbortError') {
        if (abortState.didTimeout()) {
          const timeoutError = createTimeoutError(`Ikawaari request timed out after ${options?.timeoutMs ?? clientOptions.timeoutMs}ms.`, error)
          if (attempt < maxRetries && canRetry(method, idempotencyKey)) {
            await sleep(computeRetryDelayMs(attempt))
            continue
          }
          throw timeoutError
        }

        throw createConnectionError('Ikawaari request was aborted.', error)
      }

      if (error instanceof Error && 'httpStatus' in error) {
        throw error
      }

      const connectionError = createConnectionError(error instanceof Error ? error.message : 'Ikawaari request failed.', error)
      if (attempt < maxRetries && canRetry(method, idempotencyKey)) {
        await sleep(computeRetryDelayMs(attempt))
        continue
      }

      throw connectionError
    }
  }

  throw createConnectionError('Ikawaari request failed after exhausting retries.')
}
