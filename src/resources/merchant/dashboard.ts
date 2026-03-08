import { BaseResource } from '../base.js'
import type { RequestOptions } from '../../types.js'
import type {
  MerchantDashboardOverview,
  MerchantDashboardOverviewParams,
  MerchantDashboardSummary,
  MerchantDashboardToday
} from '../types.js'

function withMerchantAuth(options?: RequestOptions): RequestOptions {
  return {
    ...options,
    authMode: 'merchantJwt'
  }
}

export class MerchantDashboardResource extends BaseResource {
  async summary(options?: RequestOptions): Promise<MerchantDashboardSummary> {
    return this.get<MerchantDashboardSummary>('/api/v1/merchant/dashboard/summary', undefined, withMerchantAuth(options))
  }

  async today(options?: RequestOptions): Promise<MerchantDashboardToday> {
    return this.get<MerchantDashboardToday>('/api/v1/merchant/dashboard/today', undefined, withMerchantAuth(options))
  }

  async overview(params: MerchantDashboardOverviewParams = {}, options?: RequestOptions): Promise<MerchantDashboardOverview> {
    return this.get<MerchantDashboardOverview>('/api/v1/merchant/dashboard/overview', params, withMerchantAuth(options))
  }
}
