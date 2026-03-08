import { BaseResource } from '../base.js'
import { Page } from '../../pagination.js'
import type { RequestOptions } from '../../types.js'
import type {
  MerchantPayment,
  MerchantPaymentDetail,
  MerchantPaymentsAnalytics,
  MerchantPaymentsAnalyticsParams,
  MerchantPaymentsListParams,
  MerchantRefund,
  MerchantRefundCreateParams
} from '../types.js'

function withMerchantAuth(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    authMode: 'merchantJwt'
  }
}

export class MerchantPaymentsResource extends BaseResource {
  async list(params: MerchantPaymentsListParams = {}, options?: RequestOptions): Promise<Page<MerchantPayment>> {
    return this.createPage<MerchantPayment>('/api/v1/merchant/payments', params, withMerchantAuth(options))
  }

  async *listAutoPaging(params: MerchantPaymentsListParams = {}, options?: RequestOptions): AsyncIterable<MerchantPayment> {
    const page = await this.list(params, options)
    for await (const item of page) {
      yield item
    }
  }

  async retrieve(id: string, options?: RequestOptions): Promise<MerchantPaymentDetail> {
    return this.get<MerchantPaymentDetail>(`/api/v1/merchant/payments/${encodeURIComponent(id)}`, undefined, withMerchantAuth(options))
  }

  async analytics(params: MerchantPaymentsAnalyticsParams = {}, options?: RequestOptions): Promise<MerchantPaymentsAnalytics> {
    return this.get<MerchantPaymentsAnalytics>('/api/v1/merchant/payments/analytics', params, withMerchantAuth(options))
  }

  async refund(id: string, params: MerchantRefundCreateParams = {}, options?: RequestOptions): Promise<MerchantPayment> {
    return this.post<MerchantPayment>(
      `/api/v1/merchant/payments/${encodeURIComponent(id)}/refund`,
      params,
      withMerchantAuth(options)
    )
  }

  async listRefunds(id: string, options?: RequestOptions): Promise<MerchantRefund[]> {
    return this.get<MerchantRefund[]>(
      `/api/v1/merchant/payments/${encodeURIComponent(id)}/refunds`,
      undefined,
      withMerchantAuth(options)
    )
  }
}
