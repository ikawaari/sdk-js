import { BaseResource } from '../base.js'
import { Page } from '../../pagination.js'
import type { RequestOptions } from '../../types.js'
import type { MerchantCustomer, MerchantCustomerDetail, MerchantCustomerListParams } from '../types.js'

function withMerchantAuth(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    authMode: 'merchantJwt'
  }
}

export class MerchantCustomersResource extends BaseResource {
  async list(params: MerchantCustomerListParams = {}, options?: RequestOptions): Promise<Page<MerchantCustomer>> {
    return this.createPage<MerchantCustomer>('/api/v1/merchant/customers', params, withMerchantAuth(options))
  }

  async *listAutoPaging(params: MerchantCustomerListParams = {}, options?: RequestOptions): AsyncIterable<MerchantCustomer> {
    const page = await this.list(params, options)
    for await (const item of page) {
      yield item
    }
  }

  async retrieve(id: string, options?: RequestOptions): Promise<MerchantCustomerDetail> {
    return this.get<MerchantCustomerDetail>(`/api/v1/merchant/customers/${encodeURIComponent(id)}`, undefined, withMerchantAuth(options))
  }
}
