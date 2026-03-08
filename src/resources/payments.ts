import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import { Page } from '../pagination.js'
import type {
  PaymentIntent,
  PaymentIntentConfirmParams,
  PaymentIntentCreateParams,
  PaymentIntentListParams,
  PaymentIntentUpdateParams
} from './types.js'

export class PaymentsResource extends BaseResource {
  async create(params: PaymentIntentCreateParams, options?: RequestOptions): Promise<PaymentIntent> {
    return this.post<PaymentIntent>('/payment_intents', params, options)
  }

  async retrieve(id: string, options?: RequestOptions): Promise<PaymentIntent> {
    return this.get<PaymentIntent>(`/payment_intents/${id}`, undefined, options)
  }

  async list(params: PaymentIntentListParams = {}, options?: RequestOptions): Promise<Page<PaymentIntent>> {
    return this.createPage<PaymentIntent>('/payment_intents', params, options)
  }

  async *listAutoPaging(params: PaymentIntentListParams = {}, options?: RequestOptions): AsyncIterable<PaymentIntent> {
    const page = await this.list(params, options)
    for await (const item of page) {
      yield item
    }
  }

  async update(id: string, params: PaymentIntentUpdateParams, options?: RequestOptions): Promise<PaymentIntent> {
    return this.patch<PaymentIntent>(`/payment_intents/${id}`, params, options)
  }

  async confirm(id: string, params: PaymentIntentConfirmParams, options?: RequestOptions): Promise<PaymentIntent> {
    return this.post<PaymentIntent>(`/payment_intents/${id}/confirm`, params, options)
  }

  async cancel(id: string, options?: RequestOptions): Promise<PaymentIntent> {
    return this.post<PaymentIntent>(`/payment_intents/${id}/cancel`, undefined, options)
  }
}
