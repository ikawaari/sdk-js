import type { ApiErrorEnvelope } from './types.js'

export interface IkawaariErrorDetails {
  code?: string
  type?: string
  requestId?: string
  httpStatus?: number
  retryable: boolean
  context?: Record<string, unknown>
  guidance: string[]
  raw?: unknown
}

export class IkawaariError extends Error {
  readonly code?: string
  readonly type?: string
  readonly requestId?: string
  readonly httpStatus?: number
  readonly retryable: boolean
  readonly context?: Record<string, unknown>
  readonly guidance: string[]
  readonly raw?: unknown

  constructor(name: string, message: string, details: IkawaariErrorDetails) {
    super(message)
    this.name = name
    this.code = details.code
    this.type = details.type
    this.requestId = details.requestId
    this.httpStatus = details.httpStatus
    this.retryable = details.retryable
    this.context = details.context
    this.guidance = details.guidance
    this.raw = details.raw
  }
}

export class AuthenticationError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('AuthenticationError', message, details)
  }
}

export class PermissionError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('PermissionError', message, details)
  }
}

export class ValidationError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('ValidationError', message, details)
  }
}

export class NotFoundError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('NotFoundError', message, details)
  }
}

export class ConflictError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('ConflictError', message, details)
  }
}

export class RateLimitError extends IkawaariError {
  readonly retryAfterSeconds?: number

  constructor(message: string, details: IkawaariErrorDetails, retryAfterSeconds?: number) {
    super('RateLimitError', message, details)
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export class ApiConnectionError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('ApiConnectionError', message, details)
  }
}

export class ApiTimeoutError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('ApiTimeoutError', message, details)
  }
}

export class ApiError extends IkawaariError {
  constructor(message: string, details: IkawaariErrorDetails) {
    super('ApiError', message, details)
  }
}

export class WebhookSignatureVerificationError extends IkawaariError {
  constructor(message: string, details?: Partial<IkawaariErrorDetails>) {
    super('WebhookSignatureVerificationError', message, {
      retryable: false,
      guidance: [],
      ...details
    })
  }
}

function toGuidanceArray(value: string | string[] | undefined): string[] {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

export function createCredentialError(message: string): AuthenticationError {
  return new AuthenticationError(message, {
    httpStatus: 401,
    retryable: false,
    guidance: ['Provide a valid Ikawaari API key or app token.']
  })
}

export function createTimeoutError(message: string, raw?: unknown): ApiTimeoutError {
  return new ApiTimeoutError(message, {
    httpStatus: 408,
    retryable: true,
    guidance: ['Retry the request after checking network conditions.'],
    raw
  })
}

export function createConnectionError(message: string, raw?: unknown): ApiConnectionError {
  return new ApiConnectionError(message, {
    retryable: true,
    guidance: ['Retry the request or inspect network connectivity.'],
    raw
  })
}

export function createIkawaariError(body: unknown, httpStatus: number, requestId?: string, retryAfterSeconds?: number): IkawaariError {
  const envelope = (body ?? {}) as ApiErrorEnvelope
  const source = envelope.error ?? envelope
  const message = source.message ?? `Ikawaari API request failed with status ${httpStatus}.`
  const details: IkawaariErrorDetails = {
    code: source.code,
    type: source.type,
    requestId,
    httpStatus,
    retryable: source.retryable ?? (httpStatus === 429 || httpStatus >= 500),
    context: source.context ?? source.details,
    guidance: toGuidanceArray(source.guidance),
    raw: body
  }

  if (httpStatus === 401) {
    return new AuthenticationError(message, details)
  }

  if (httpStatus === 403) {
    return new PermissionError(message, details)
  }

  if (httpStatus === 400 || httpStatus === 422) {
    return new ValidationError(message, details)
  }

  if (httpStatus === 404) {
    return new NotFoundError(message, details)
  }

  if (httpStatus === 409) {
    return new ConflictError(message, details)
  }

  if (httpStatus === 429) {
    return new RateLimitError(message, details, retryAfterSeconds)
  }

  return new ApiError(message, details)
}
