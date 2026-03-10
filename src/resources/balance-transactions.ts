import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import { Page } from '../pagination.js'
import type { BalanceTransaction, BalanceTransactionListParams } from './types.js'

const BALANCE_TRANSACTIONS_PATH = '/api/v1/balance-transactions'

export class BalanceTransactionsResource extends BaseResource {
  async list(params: BalanceTransactionListParams = {}, options?: RequestOptions): Promise<Page<BalanceTransaction>> {
    return this.createPage<BalanceTransaction>(BALANCE_TRANSACTIONS_PATH, params, options)
  }

  async *listAutoPaging(params: BalanceTransactionListParams = {}, options?: RequestOptions): AsyncIterable<BalanceTransaction> {
    const page = await this.list(params, options)
    for await (const item of page) {
      yield item
    }
  }
}
