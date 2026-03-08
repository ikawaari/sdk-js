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

export class WebhooksResource extends BaseResource {
  async createEndpoint(params: CreateWebhookEndpointParams, options?: RequestOptions): Promise<CreateWebhookEndpointResponse> {
    return this.post<CreateWebhookEndpointResponse>('/webhook_endpoints', toWebhookPayload(params), options)
  }

  async retrieveEndpoint(id: string, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.get<WebhookEndpoint>(`/webhook_endpoints/${id}`, undefined, options)
  }

  async listEndpoints(options?: RequestOptions): Promise<WebhookEndpoint[]> {
    return this.get<WebhookEndpoint[]>('/webhook_endpoints', undefined, options)
  }

  async updateEndpoint(id: string, params: UpdateWebhookEndpointParams, options?: RequestOptions): Promise<WebhookEndpoint> {
    return this.post<WebhookEndpoint>(`/webhook_endpoints/${id}`, toWebhookPayload(params), options)
  }

  async rotateSecret(id: string, options?: RequestOptions): Promise<RotateWebhookSecretResponse> {
    return this.post<RotateWebhookSecretResponse>(`/webhook_endpoints/${id}/rotate_secret`, undefined, options)
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
