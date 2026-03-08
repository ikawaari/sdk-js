import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import type { Balance } from './types.js'

export class BalanceResource extends BaseResource {
  async retrieve(options?: RequestOptions): Promise<Balance> {
    return this.get<Balance>('/balance', undefined, options)
  }
}
