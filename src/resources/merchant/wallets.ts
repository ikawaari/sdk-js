import { BaseResource } from '../base.js'
import { Page } from '../../pagination.js'
import type { QueryParams, RequestOptions } from '../../types.js'
import type {
  ApplyCustomerWalletToInvoiceParams,
  MerchantCustomerWalletBalance,
  MerchantCustomerWalletTopUpParams,
  MerchantCustomerWalletTransaction,
  MerchantCustomerWalletTransactionListParams,
  MerchantWalletApplyResult,
  MerchantWalletTopUpResponse
} from '../types.js'

function withMerchantAuth(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    authMode: 'merchantJwt'
  }
}

export class MerchantWalletsResource extends BaseResource {
  async getBalance(customerId: string, currency?: string, options?: RequestOptions): Promise<MerchantCustomerWalletBalance> {
    const query: QueryParams | undefined = currency ? { currency } : undefined
    return this.get<MerchantCustomerWalletBalance>(
      `/api/v1/merchant/billing/wallet/customers/${encodeURIComponent(customerId)}/balance`,
      query,
      withMerchantAuth(options)
    )
  }

  async listTransactions(customerId: string, params: MerchantCustomerWalletTransactionListParams = {}, options?: RequestOptions): Promise<Page<MerchantCustomerWalletTransaction>> {
    return this.createPage<MerchantCustomerWalletTransaction>(
      `/api/v1/merchant/billing/wallet/customers/${encodeURIComponent(customerId)}/transactions`,
      params,
      withMerchantAuth(options)
    )
  }

  async *listTransactionsAutoPaging(customerId: string, params: MerchantCustomerWalletTransactionListParams = {}, options?: RequestOptions): AsyncIterable<MerchantCustomerWalletTransaction> {
    const page = await this.listTransactions(customerId, params, options)
    for await (const item of page) {
      yield item
    }
  }

  async topUp(customerId: string, params: MerchantCustomerWalletTopUpParams, options?: RequestOptions): Promise<MerchantWalletTopUpResponse> {
    return this.post<MerchantWalletTopUpResponse>(
      `/api/v1/merchant/billing/wallet/customers/${encodeURIComponent(customerId)}/topups`,
      params,
      withMerchantAuth(options)
    )
  }

  async applyToInvoice(invoiceId: string, params: ApplyCustomerWalletToInvoiceParams, options?: RequestOptions): Promise<MerchantWalletApplyResult> {
    return this.post<MerchantWalletApplyResult>(
      `/api/v1/merchant/billing/wallet/invoices/${encodeURIComponent(invoiceId)}/apply`,
      params,
      withMerchantAuth(options)
    )
  }
}
