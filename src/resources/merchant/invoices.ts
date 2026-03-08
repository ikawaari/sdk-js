import { BaseResource } from '../base.js'
import { Page } from '../../pagination.js'
import type { RequestOptions } from '../../types.js'
import type {
  MerchantInvoice,
  MerchantInvoiceCreateParams,
  MerchantInvoicesListParams,
  MerchantInvoiceUpdateStatusParams
} from '../types.js'

function withMerchantAuth(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    authMode: 'merchantJwt'
  }
}

export class MerchantInvoicesResource extends BaseResource {
  async list(params: MerchantInvoicesListParams = {}, options?: RequestOptions): Promise<Page<MerchantInvoice>> {
    return this.createPage<MerchantInvoice>('/api/v1/merchant/invoices', params, withMerchantAuth(options))
  }

  async *listAutoPaging(params: MerchantInvoicesListParams = {}, options?: RequestOptions): AsyncIterable<MerchantInvoice> {
    const page = await this.list(params, options)
    for await (const item of page) {
      yield item
    }
  }

  async retrieve(id: string, options?: RequestOptions): Promise<MerchantInvoice> {
    return this.get<MerchantInvoice>(`/api/v1/merchant/invoices/${encodeURIComponent(id)}`, undefined, withMerchantAuth(options))
  }

  async create(params: MerchantInvoiceCreateParams, options?: RequestOptions): Promise<MerchantInvoice> {
    return this.post<MerchantInvoice>('/api/v1/merchant/invoices', params, withMerchantAuth(options))
  }

  async updateStatus(id: string, params: MerchantInvoiceUpdateStatusParams, options?: RequestOptions): Promise<void> {
    await this.patch<void>(`/api/v1/merchant/invoices/${encodeURIComponent(id)}/status`, params, withMerchantAuth(options))
  }
}
