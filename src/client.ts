import { resolveClientOptions, type ResolvedClientOptions } from './config.js'
import { executeRequest } from './transport/http-client.js'
import type { ApiResponse, ClientOptions, HttpMethod, RequestOptions } from './types.js'
import { BalanceResource } from './resources/balance.js'
import { BalanceTransactionsResource } from './resources/balance-transactions.js'
import { MerchantNamespace } from './resources/merchant/namespace.js'
import { MobileMoneyResource } from './resources/mobile-money.js'
import { PaymentsResource } from './resources/payments.js'
import { PayoutsResource } from './resources/payouts.js'
import { SandboxResource } from './resources/sandbox.js'
import { WebhooksResource } from './resources/webhooks.js'

export class Ikawaari {
  readonly payments: PaymentsResource
  readonly payouts: PayoutsResource
  readonly balance: BalanceResource
  readonly balanceTransactions: BalanceTransactionsResource
  readonly webhooks: WebhooksResource
  readonly sandbox: SandboxResource
  readonly mobileMoney: MobileMoneyResource
  readonly merchant: MerchantNamespace
  private readonly options: ResolvedClientOptions

  constructor(options: ClientOptions) {
    this.options = resolveClientOptions(options)
    this.payments = new PaymentsResource(this)
    this.payouts = new PayoutsResource(this)
    this.balance = new BalanceResource(this)
    this.balanceTransactions = new BalanceTransactionsResource(this)
    this.webhooks = new WebhooksResource(this)
    this.sandbox = new SandboxResource(this)
    this.mobileMoney = new MobileMoneyResource(this)
    this.merchant = new MerchantNamespace(this)
  }

  get config(): Omit<ResolvedClientOptions, 'fetch'> {
    const { fetch: _fetch, ...config } = this.options
    return config
  }

  async request<T>(method: HttpMethod, path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return executeRequest<T>({
      clientOptions: this.options,
      method,
      path,
      body,
      options
    })
  }
}

export type IkawaariClient = Ikawaari
