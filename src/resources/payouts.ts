import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import type { Payout, PayoutCreateParams } from './types.js'

export class PayoutsResource extends BaseResource {
  async create(params: PayoutCreateParams, options?: RequestOptions): Promise<Payout> {
    return this.post<Payout>('/payouts', params, options)
  }

  async retrieve(id: string, options?: RequestOptions): Promise<Payout> {
    return this.get<Payout>(`/payouts/${id}`, undefined, options)
  }
}
