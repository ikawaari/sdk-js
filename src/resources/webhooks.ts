import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import {
  constructWebhookEvent,
  parseSignatureHeader,
  parseWebhookEvent,
  verifyWebhookSignature
} from '../webhooks.js'
import type {
  CreateWebhookEndpointResponse,
  CreateWebhookEndpointParams,
  RotateWebhookSecretResponse,
  UpdateWebhookEndpointParams,
  WebhookEndpoint,
  WebhookEvent
} from './types.js'

function toWebhookPayload(params: CreateWebhookEndpointParams | UpdateWebhookEndpointParams): Record<string, unknown> {
  const enabledEvents = params.enabled_events ?? params.enabledEvents ?? params.events
  return {
    url: params.url,
    enabled_events: enabledEvents,
    enabled: 'enabled' in params ? params.enabled : undefined
  }
}

const WEBHOOK_ENDPOINTS_PATH = '/api/v1/webhook-endpoints'

export class WebhooksResource extends BaseResource {
  async createEndpoint(params: CreateWebhookEndpointParams, options?: RequestOptions): Promise<CreateWebhookEndpointResponse> {
    return this.post<CreateWebhookEndpointResponse>(WEBHOOK_ENDPOINTS_PATH, toWebhookPayload(params), options)
  }

  async retrieveEndpoint(id: string, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.get<WebhookEndpoint>(`${WEBHOOK_ENDPOINTS_PATH}/${id}`, undefined, options)
  }

  async listEndpoints(options?: RequestOptions): Promise<WebhookEndpoint[]> {
    return this.get<WebhookEndpoint[]>(WEBHOOK_ENDPOINTS_PATH, undefined, options)
  }

  async updateEndpoint(id: string, params: UpdateWebhookEndpointParams, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.post<WebhookEndpoint>(`${WEBHOOK_ENDPOINTS_PATH}/${id}`, toWebhookPayload(params), options)
  }

  async rotateSecret(id: string, options?: RequestOptions): Promise<RotateWebhookSecretResponse> {
    return this.post<RotateWebhookSecretResponse>(`${WEBHOOK_ENDPOINTS_PATH}/${id}/rotate_secret`, undefined, options)
  }

  verifySignature(payload: string | Buffer, signatureHeader: string, secret: string, toleranceSeconds = 300): boolean {
    return verifyWebhookSignature(payload, signatureHeader, secret, { toleranceSeconds })
  }

  constructEvent<T = unknown>(payload: string | Buffer, signatureHeader: string, secret: string, toleranceSeconds = 300): WebhookEvent<T> {
    return constructWebhookEvent<T>(payload, signatureHeader, secret, { toleranceSeconds })
  }

  parseEvent<T = unknown>(payload: string | Buffer): WebhookEvent<T> {
    return parseWebhookEvent<T>(payload)
  }

  parseSignatureHeader(signatureHeader: string) {
    return parseSignatureHeader(signatureHeader)
  }
}
