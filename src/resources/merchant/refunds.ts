import { BaseResource } from '../base.js'
import type { RequestOptions } from '../../types.js'
import type { MerchantPayment, MerchantRefund, MerchantRefundCreateParams } from '../types.js'

function withMerchantAuth(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    authMode: 'merchantJwt'
  }
}

export class MerchantRefundsResource extends BaseResource {
  async list(paymentId: string, options?: RequestOptions): Promise<MerchantRefund[]> {
    return this.get<MerchantRefund[]>(
      `/api/v1/merchant/payments/${encodeURIComponent(paymentId)}/refunds`,
      undefined,
      withMerchantAuth(options)
    )
  }

  async create(paymentId: string, params: MerchantRefundCreateParams = {}, options?: RequestOptions): Promise<MerchantPayment> {
    return this.post<MerchantPayment>(
      `/api/v1/merchant/payments/${encodeURIComponent(paymentId)}/refund`,
      params,
      withMerchantAuth(options)
    )
  }
}
