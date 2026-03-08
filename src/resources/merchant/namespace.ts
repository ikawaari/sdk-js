import type { Ikawaari } from '../../client.js'
import { MerchantCustomersResource } from './customers.js'
import { MerchantDashboardResource } from './dashboard.js'
import { MerchantInvoicesResource } from './invoices.js'
import { MerchantPaymentsResource } from './payments.js'
import { MerchantRefundsResource } from './refunds.js'
import { MerchantTransactionsResource } from './transactions.js'
import { MerchantWalletsResource } from './wallets.js'

export class MerchantNamespace {
  readonly customers: MerchantCustomersResource
  readonly dashboard: MerchantDashboardResource
  readonly invoices: MerchantInvoicesResource
  readonly payments: MerchantPaymentsResource
  readonly refunds: MerchantRefundsResource
  readonly transactions: MerchantTransactionsResource
  readonly wallets: MerchantWalletsResource

  constructor(client: Ikawaari) {
    this.customers = new MerchantCustomersResource(client)
    this.dashboard = new MerchantDashboardResource(client)
    this.invoices = new MerchantInvoicesResource(client)
    this.payments = new MerchantPaymentsResource(client)
    this.refunds = new MerchantRefundsResource(client)
    this.transactions = new MerchantTransactionsResource(client)
    this.wallets = new MerchantWalletsResource(client)
  }
}
