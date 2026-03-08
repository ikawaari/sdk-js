export type IkawaariEnvironment = 'sandbox' | 'live'

export type AuthMode = 'apiKey' | 'appToken' | 'merchantJwt' | 'none'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type QueryParamPrimitive = string | number | boolean | null | undefined

export type QueryParams = Record<string, QueryParamPrimitive | QueryParamPrimitive[]>

export interface ClientOptions {
  apiKey?: string
  appToken?: string
  merchantToken?: string
  baseUrl: string
  environment?: IkawaariEnvironment
  timeoutMs?: number
  maxNetworkRetries?: number
  headers?: Record<string, string>
  userAgent?: string
  fetch?: typeof fetch
}

export interface RequestOptions {
  authMode?: AuthMode
  idempotencyKey?: string
  headers?: Record<string, string>
  query?: QueryParams
  signal?: AbortSignal
  timeoutMs?: number
}

export interface ApiResponse<T> {
  data: T
  status: number
  requestId?: string
  headers: Headers
  raw: unknown
}

export interface ListMeta {
  hasMore: boolean
  nextCursor?: string
  page?: number
  limit?: number
  total?: number
}

export interface IkawaariListResponse<T> extends ListMeta {
  object: 'list'
  data: T[]
  raw: unknown
}

export interface ApiErrorEnvelope {
  error?: {
    code?: string
    message?: string
    type?: string
    context?: Record<string, unknown>
    retryable?: boolean
    guidance?: string | string[]
    details?: Record<string, unknown>
  }
  code?: string
  message?: string
  type?: string
  context?: Record<string, unknown>
  retryable?: boolean
  guidance?: string | string[]
  details?: Record<string, unknown>
}

export interface WebhookSignatureParts {
  timestamp: number
  signatures: string[]
  rawHeader: string
}

export interface WebhookConstructOptions {
  toleranceSeconds?: number
  nowMs?: number
}
