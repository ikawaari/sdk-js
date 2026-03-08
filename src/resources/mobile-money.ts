import { BaseResource } from './base.js'
import type {
  MobileMoneyCollectParams,
  MobileMoneyCollectResult,
  MobileMoneyPayoutParams,
  MobileMoneySupportedOperator,
  PaymentIntent
} from './types.js'
import type { RequestOptions } from '../types.js'

const SUPPORTED_OPERATORS: MobileMoneySupportedOperator[] = [
  { code: 'wave_sn', country: 'SN', display_name: 'Wave Senegal' },
  { code: 'orange_ci', country: 'CI', display_name: 'Orange Money Côte d’Ivoire' },
  { code: 'mtn_ci', country: 'CI', display_name: 'MTN Mobile Money Côte d’Ivoire' },
  { code: 'moov_ci', country: 'CI', display_name: 'Moov Money Côte d’Ivoire' }
]

export class MobileMoneyResource extends BaseResource {
  async collect(params: MobileMoneyCollectParams, options?: RequestOptions): Promise<MobileMoneyCollectResult> {
    const paymentIntent = await this.client.payments.create({
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      metadata: params.metadata,
      payment_method_types: ['mobile_money'],
      customer: params.customer,
      customer_id: params.customer_id
    }, options)

    const confirmed = await this.client.payments.confirm(paymentIntent.id, {
      return_url: params.return_url,
      payment_method: {
        type: 'mobile_money',
        mobile_money: {
          operator: params.operator,
          country: params.country,
          msisdn: this.normalizeMsisdn(params.msisdn, params.country)
        }
      }
    }, options)

    return {
      payment_intent: confirmed
    }
  }

  async payout(params: MobileMoneyPayoutParams, options?: RequestOptions) {
    return this.client.payouts.create({
      amount: params.amount,
      currency: params.currency,
      description: params.description,
      metadata: params.metadata,
      destination: {
        type: 'mobile_money',
        mobile_money: {
          operator: params.operator,
          country: params.country,
          phone: this.normalizeMsisdn(params.phone, params.country)
        }
      }
    }, options)
  }

  getSupportedOperators(country?: string): MobileMoneySupportedOperator[] {
    if (!country) {
      return [...SUPPORTED_OPERATORS]
    }

    const normalizedCountry = country.trim().toUpperCase()
    return SUPPORTED_OPERATORS.filter((operator) => operator.country === normalizedCountry)
  }

  normalizeMsisdn(msisdn: string, country?: string): string {
    const compact = msisdn.replace(/[\s\-()]/g, '')
    if (compact.startsWith('+')) {
      return compact
    }

    if (!country) {
      return compact
    }

    const normalizedCountry = country.trim().toUpperCase()
    if (normalizedCountry === 'CI') {
      return `+225${compact.replace(/^0+/, '')}`
    }
    if (normalizedCountry === 'SN') {
      return `+221${compact.replace(/^0+/, '')}`
    }

    return compact
  }

  formatOperator(operator: string): string {
    const match = SUPPORTED_OPERATORS.find((item) => item.code === operator)
    return match?.display_name ?? operator
  }
}
