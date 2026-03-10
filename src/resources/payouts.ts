import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import type { Payout, PayoutCreateParams } from './types.js'

const PAYOUTS_PATH = '/api/v1/payouts'

export class PayoutsResource extends BaseResource {
  async create(params: PayoutCreateParams, options?: RequestOptions): Promise<Payout> {
    return this.post<Payout>(PAYOUTS_PATH, params, options)
  }

  async retrieve(id: string, options?: RequestOptions): Promise<Payout> {
    return this.get<Payout>(`${PAYOUTS_PATH}/${id}`, undefined, options)
  }
}
