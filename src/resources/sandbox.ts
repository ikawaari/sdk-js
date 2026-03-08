import { BaseResource } from './base.js'
import type { RequestOptions } from '../types.js'
import type { SandboxSimulatePaymentParams, SandboxSimulatePayoutParams } from './types.js'

export class SandboxResource extends BaseResource {
  async simulatePayment(params: SandboxSimulatePaymentParams, options?: RequestOptions): Promise<unknown> {
    return this.post('/api/test/mobile-money/callback', {
      payment_intent_id: params.payment_intent_id,
      status: params.outcome,
      failure_reason: params.failure_reason
    }, {
      ...options,
      authMode: 'none'
    })
  }

  async simulatePayout(params: SandboxSimulatePayoutParams, options?: RequestOptions): Promise<unknown> {
    return this.post('/api/test/payouts/callback', {
      payout_id: params.payout_id,
      status: params.outcome,
      failure_code: params.failure_code,
      failure_message: params.failure_message
    }, {
      ...options,
      authMode: 'none'
    })
  }
}
