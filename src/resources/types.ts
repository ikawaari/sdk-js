import type { QueryParams } from '../types.js'

export interface Metadata {
  [key: string]: string
}

export interface MobileMoneyDetails {
  operator?: string
  country?: string
  msisdn?: string
  phone?: string
}

export interface PaymentMethod {
  type: string
  mobile_money?: MobileMoneyDetails
  [key: string]: unknown
}

export interface PaymentIntent {
  id: string
  object?: 'payment_intent'
  amount: number
  currency: string
  status: string
  description?: string
  metadata?: Metadata
  payment_method_types?: string[]
  customer?: string
  created?: number
  [key: string]: unknown
}

export interface PaymentIntentCreateParams {
  amount: number
  currency: string
  description?: string
  metadata?: Metadata
  payment_method_types?: string[]
  confirm?: boolean
  customer?: string
  customer_id?: string
  customer_email?: string
  customer_phone?: string
  payment_method?: string | PaymentMethod
}

export interface PaymentIntentUpdateParams {
  description?: string
  metadata?: Metadata
}

export interface PaymentIntentConfirmParams {
  return_url?: string
  payment_method?: PaymentMethod
  payment_method_data?: PaymentMethod
}

export type PaymentIntentListParams = QueryParams & {
  limit?: number
  page?: number
  cursor?: string
}

export interface PayoutDestination {
  type: string
  mobile_money?: MobileMoneyDetails
  bank?: Record<string, unknown>
  [key: string]: unknown
}

export interface Payout {
  id: string
  object?: 'payout'
  amount: number
  currency: string
  status: string
  description?: string
  metadata?: Metadata
  destination?: PayoutDestination
  created?: number
  [key: string]: unknown
}

export interface PayoutCreateParams {
  amount: number
  currency: string
  destination: PayoutDestination
  description?: string
  metadata?: Metadata
}

export interface WebhookEndpoint {
  id: string
  object?: 'webhook_endpoint'
  url: string
  enabled_events?: string[]
  enabledEvents?: string[]
  events?: string[]
  enabled?: boolean
  secret?: string
  created?: number
  [key: string]: unknown
}

export interface CreateWebhookEndpointParams {
  url: string
  enabled_events?: string[]
  enabledEvents?: string[]
  events?: string[]
}

export interface UpdateWebhookEndpointParams {
  url?: string
  enabled_events?: string[]
  enabledEvents?: string[]
  events?: string[]
  enabled?: boolean
}

export interface CreateWebhookEndpointResponse extends WebhookEndpoint {
  secret: string
}

export interface RotateWebhookSecretResponse {
  id?: string
  secret: string
  [key: string]: unknown
}

export interface WebhookEvent<T = unknown> {
  id?: string
  object?: string
  type: string
  created?: number
  data: { object: T } | T
  livemode?: boolean
  [key: string]: unknown
}

export interface BalanceAmount {
  amount: number
  currency: string
  [key: string]: unknown
}

export interface Balance {
  object?: 'balance'
  available?: BalanceAmount[]
  pending?: BalanceAmount[]
  [key: string]: unknown
}

export interface BalanceTransaction {
  id: string
  object?: 'balance_transaction'
  amount: number
  currency: string
  type?: string
  created?: number
  description?: string
  [key: string]: unknown
}

export type BalanceTransactionListParams = QueryParams & {
  limit?: number
  page?: number
  cursor?: string
}

export interface SandboxSimulatePaymentParams {
  payment_intent_id: string
  outcome: 'succeeded' | 'failed'
  failure_reason?: string
}

export interface SandboxSimulatePayoutParams {
  payout_id: string
  outcome: 'paid' | 'failed'
  failure_code?: string
  failure_message?: string
}

export interface MobileMoneyCollectParams {
  amount: number
  currency: string
  operator: string
  country: string
  msisdn: string
  description?: string
  metadata?: Metadata
  return_url?: string
  customer?: string
  customer_id?: string
}

export interface MobileMoneyPayoutParams {
  amount: number
  currency: string
  operator: string
  phone: string
  country?: string
  description?: string
  metadata?: Metadata
}

export interface MobileMoneyCollectResult {
  payment_intent: PaymentIntent
}

export interface MobileMoneySupportedOperator {
  code: string
  country?: string
  display_name: string
}

export type MerchantCustomerListParams = QueryParams & {
  page?: number
  limit?: number
  search?: string
}

export interface MerchantPaymentSummary {
  id: string
  amount: number
  amountReceived?: number
  currency: string
  status: string
  paymentMethod?: string
  operator?: string
  country?: string
  customerPhone?: string
  description?: string
  metadata?: Metadata
  createdAt?: string
  succeededAt?: string
  [key: string]: unknown
}

export type MerchantPaymentsListParams = QueryParams & {
  page?: number
  limit?: number
  status?: string
  search?: string
  from?: string
  to?: string
  amountMin?: number
  amountMax?: number
  operators?: string
  countries?: string
  paymentMethod?: string
  sortBy?: string
  sortDirection?: string
}

export interface MerchantPayment extends MerchantPaymentSummary {}

export interface MerchantPaymentEvent {
  type: string
  status: string
  timestamp: string
  message?: string
  [key: string]: unknown
}

export interface MerchantRefund {
  id: string
  amount: number
  status: string
  reason?: string
  createdAt?: string
  [key: string]: unknown
}

export interface MerchantPaymentDetail extends MerchantPayment {
  timeline?: MerchantPaymentEvent[]
  refunds?: MerchantRefund[]
  refundedAmount?: number
  canRefund?: boolean
}

export interface MerchantRefundCreateParams {
  amount?: number
  reason?: string
}

export interface MerchantRevenueDataPoint {
  date: string
  amount: number
  count: number
}

export interface MerchantRevenueChart {
  data: MerchantRevenueDataPoint[]
  period: string
}

export interface MerchantDashboardRevenueSummary {
  today: number
  todayChange: number
  thisWeek: number
  thisWeekChange: number
  thisMonth: number
  thisMonthChange: number
  currency: string
}

export interface MerchantDashboardTransactionSummary {
  todayCount: number
  thisWeekCount: number
  thisMonthCount: number
  succeededCount: number
  failedCount: number
  pendingCount: number
}

export interface MerchantDashboardRecentTransaction {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  operator?: string
  createdAt: string
}

export interface MerchantDashboardSummary {
  revenue: MerchantDashboardRevenueSummary
  transactions: MerchantDashboardTransactionSummary
  successRate: number
  recentTransactions: MerchantDashboardRecentTransaction[]
}

export interface MerchantDashboardTodayRevenue {
  today: number
  yesterday: number
  changePercent: number
  count: number
  trend: MerchantRevenueChart
}

export interface MerchantDashboardTodayPayouts {
  pendingCount: number
  pendingAmount: number
  inTransitCount: number
  lastCompletedAt?: string
}

export interface MerchantDashboardTodayOperations {
  successRate: number
  failedPaymentsCount: number
  pendingPaymentsCount: number
}

export interface MerchantDashboardToday {
  currency: string
  revenue: MerchantDashboardTodayRevenue
  balance: MerchantBalance
  payouts: MerchantDashboardTodayPayouts
  operations: MerchantDashboardTodayOperations
  generatedAt: string
}

export type MerchantDashboardOverviewParams = QueryParams & {
  period?: string
  granularity?: string
  compare?: string
}

export interface MerchantDashboardOverviewPayments {
  amount: number
  previousAmount: number
  changePercent: number
  count: number
  previousCount: number
  countChangePercent: number
  currency: string
}

export interface MerchantDashboardOverviewMetric {
  amount: number
  previousAmount: number
  changePercent: number
  currency: string
}

export interface MerchantDashboardOverviewCountMetric {
  count: number
  previousCount: number
  changePercent: number
}

export interface MerchantDashboardTopCustomer {
  id: string
  name?: string
  email?: string
  phone?: string
  totalSpent: number
  paymentCount: number
  currency: string
}

export interface MerchantDashboardOverview {
  period: string
  granularity: string
  compareMode: string
  currency: string
  payments: MerchantDashboardOverviewPayments
  grossVolume: MerchantDashboardOverviewMetric
  netVolume: MerchantDashboardOverviewMetric
  failedPayments: MerchantDashboardOverviewCountMetric
  newCustomers: MerchantDashboardOverviewCountMetric
  topCustomers: MerchantDashboardTopCustomer[]
  trend: MerchantRevenueChart
  generatedAt: string
}

export type MerchantTransactionsListParams = QueryParams & {
  page?: number
  limit?: number
  type?: string
  status?: string
  search?: string
  from?: string
  to?: string
  amountMin?: number
  amountMax?: number
  paymentMethod?: string
}

export interface MerchantTransaction {
  id: string
  type: string
  amount: number
  currency: string
  status: string
  paymentMethod?: string
  paymentMethodBrand?: string
  description?: string
  customerEmail?: string
  customerPhone?: string
  createdAt: string
  completedAt?: string
  refundedAt?: string
  failureReason?: string
  metadata?: Metadata
}

export type MerchantTransactionStatsParams = QueryParams & {
  type?: string
  from?: string
  to?: string
}

export interface MerchantTransactionStats {
  total: number
  succeeded: number
  failed: number
  pending: number
  refunded: number
  disputed: number
  uncaptured: number
}

export type MerchantPaymentsAnalyticsParams = QueryParams & {
  from?: string
  to?: string
}

export interface MerchantPaymentsOperatorAnalytics {
  operator: string
  totalCount: number
  succeededCount: number
  successRatePercent: number
}

export interface MerchantPaymentsMethodAnalytics {
  paymentMethod: string
  totalAmount: number
  totalCount: number
}

export interface MerchantPaymentsAnalytics {
  operators: MerchantPaymentsOperatorAnalytics[]
  paymentMethods: MerchantPaymentsMethodAnalytics[]
  averageProcessingTimeSeconds: number
}

export interface MerchantBalance {
  available: number
  pending: number
  reserved: number
  currency: string
}

export interface MerchantCustomer {
  id: string
  email: string
  phone?: string
  name?: string
  createdAt?: string
  totalSpent?: number
  paymentCount?: number
  [key: string]: unknown
}

export interface MerchantCustomerDetail extends MerchantCustomer {
  payments?: MerchantPaymentSummary[]
}

export interface MerchantCustomerWalletBalance {
  customerId: string
  currency: string
  balance: number
  [key: string]: unknown
}

export interface MerchantCustomerWalletTransaction {
  id: string
  direction: string
  type: string
  amount: number
  currency: string
  referenceType: string
  referenceId: string
  description?: string
  occurredAt?: string
  [key: string]: unknown
}

export type MerchantCustomerWalletTransactionListParams = QueryParams & {
  page?: number
  limit?: number
  currency?: string
}

export interface MerchantCustomerWalletTopUpParams {
  amount: number
  currency: string
  country: string
  operator: string
  msisdn: string
  returnUrl?: string
  idempotencyKey?: string
  description?: string
}

export interface MerchantWalletTopUpResponse {
  paymentIntent: PaymentIntent
}

export interface ApplyCustomerWalletToInvoiceParams {
  customerId: string
  amount?: number
  idempotencyKey?: string
  description?: string
}

export interface MerchantWalletApplyResult {
  invoiceId: string
  customerId: string
  currency: string
  appliedAmount: number
  remainingBalance: number
  invoicePaid: boolean
  [key: string]: unknown
}

export type MerchantInvoicesListParams = QueryParams & {
  page?: number
  limit?: number
  status?: string
}

export interface MerchantInvoice {
  id: string
  invoiceNumber: string
  status: string
  amount: number
  currency: string
  dueDate?: string
  createdAt?: string
  customerEmail?: string
  customerName?: string
  description?: string
  [key: string]: unknown
}

export interface MerchantInvoiceCreateParams {
  customerId?: string
  amount: number
  currency: string
  dueDate?: string
  customerEmail?: string
  customerName?: string
  description?: string
}

export interface MerchantInvoiceUpdateStatusParams {
  status: string
}
