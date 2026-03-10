import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import type { Balance } from './types.js'

const BALANCE_PATH = '/api/v1/balance'

export class BalanceResource extends BaseResource {
  async retrieve(options?: RequestOptions): Promise<Balance> {
    return this.get<Balance>(BALANCE_PATH, undefined, options)
  }
}
