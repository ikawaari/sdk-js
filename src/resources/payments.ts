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

const PAYMENTS_PATH = '/api/v1/payment-intents'

export class PaymentsResource extends BaseResource {
  async create(params: PaymentIntentCreateParams, options?: RequestOptions): Promise<PaymentIntent> {
    return this.post<PaymentIntent>(PAYMENTS_PATH, params, options)
  }

  async retrieve(id: string, options?: RequestOptions): Promise<PaymentIntent> {
    return this.get<PaymentIntent>(`${PAYMENTS_PATH}/${id}`, undefined, options)
  }

  async list(params: PaymentIntentListParams = {}, options?: RequestOptions): Promise<Page<PaymentIntent>> {
    return this.createPage<PaymentIntent>(PAYMENTS_PATH, params, options)
  }

  async *listAutoPaging(params: PaymentIntentListParams = {}, options?: RequestOptions): AsyncIterable<PaymentIntent> {
    const page = await this.list(params, options)
    for await (const item of page) {
      yield item
    }
  }

  async update(id: string, params: PaymentIntentUpdateParams, options?: RequestOptions): Promise<PaymentIntent> {
    return this.patch<PaymentIntent>(`${PAYMENTS_PATH}/${id}`, params, options)
  }

  async confirm(id: string, params: PaymentIntentConfirmParams, options?: RequestOptions): Promise<PaymentIntent> {
    return this.post<PaymentIntent>(`${PAYMENTS_PATH}/${id}/confirm`, params, options)
  }

  async cancel(id: string, options?: RequestOptions): Promise<PaymentIntent> {
    return this.post<PaymentIntent>(`${PAYMENTS_PATH}/${id}/cancel`, undefined, options)
  }
}
