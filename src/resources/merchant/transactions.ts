import { BaseResource } from '../base.js'
import { Page } from '../../pagination.js'
import type { RequestOptions } from '../../types.js'
import type {
  MerchantTransaction,
  MerchantTransactionsListParams,
  MerchantTransactionStats,
  MerchantTransactionStatsParams
} from '../types.js'

function withMerchantAuth(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    authMode: 'merchantJwt'
  }
}

export class MerchantTransactionsResource extends BaseResource {
  async list(params: MerchantTransactionsListParams = {}, options?: RequestOptions): Promise<Page<MerchantTransaction>> {
    return this.createPage<MerchantTransaction>('/api/v1/merchant/transactions', params, withMerchantAuth(options))
  }

  async *listAutoPaging(params: MerchantTransactionsListParams = {}, options?: RequestOptions): AsyncIterable<MerchantTransaction> {
    const page = await this.list(params, options)
    for await (const item of page) {
      yield item
    }
  }

  async stats(params: MerchantTransactionStatsParams = {}, options?: RequestOptions): Promise<MerchantTransactionStats> {
    return this.get<MerchantTransactionStats>('/api/v1/merchant/transactions/stats', params, withMerchantAuth(options))
  }
}
