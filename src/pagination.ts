import type { IkawaariListResponse, QueryParams } from './types.js'

type FetchNextPage<T> = () => Promise<Page<T> | null>

export class Page<T> implements AsyncIterable<T> {
  readonly object: 'list'
  readonly data: T[]
  readonly hasMore: boolean
  readonly nextCursor?: string
  readonly page?: number
  readonly limit?: number
  readonly total?: number
  readonly raw: unknown
  private readonly fetchNextPage: FetchNextPage<T> | undefined

  constructor(response: IkawaariListResponse<T>, fetchNextPage?: FetchNextPage<T>) {
    this.object = response.object
    this.data = response.data
    this.hasMore = response.hasMore
    this.nextCursor = response.nextCursor
    this.page = response.page
    this.limit = response.limit
    this.total = response.total
    this.raw = response.raw
    this.fetchNextPage = fetchNextPage
  }

  async getNextPage(): Promise<Page<T> | null> {
    if (!this.fetchNextPage || !this.hasMore) {
      return null
    }

    return this.fetchNextPage()
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    let current: Page<T> | null = this

    while (current) {
      for (const item of current.data) {
        yield item
      }

      current = await current.getNextPage()
    }
  }
}

function readBoolean(value: unknown): boolean | undefined {
  return typeof value === 'boolean' ? value : undefined
}

function readNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

export function normalizeListResponse<T>(raw: unknown): IkawaariListResponse<T> {
  if (Array.isArray(raw)) {
    return {
      object: 'list',
      data: raw as T[],
      hasMore: false,
      raw
    }
  }

  if (!raw || typeof raw !== 'object') {
    return {
      object: 'list',
      data: [],
      hasMore: false,
      raw
    }
  }

  const record = raw as Record<string, unknown>
  const data = Array.isArray(record.data)
    ? (record.data as T[])
    : Array.isArray(record.items)
      ? (record.items as T[])
      : []

  const hasMore = readBoolean(record.hasMore) ?? readBoolean(record.has_more) ?? false
  const nextCursor = readString(record.nextCursor) ?? readString(record.next_cursor)
  const page = readNumber(record.page)
  const limit = readNumber(record.limit)
  const total = readNumber(record.total) ?? readNumber(record.totalCount)

  return {
    object: 'list',
    data,
    hasMore,
    nextCursor,
    page,
    limit,
    total,
    raw
  }
}

export function resolveNextQuery(currentQuery: QueryParams | undefined, response: IkawaariListResponse<unknown>): QueryParams | undefined {
  if (!response.hasMore) {
    return undefined
  }

  const nextQuery: QueryParams = { ...(currentQuery ?? {}) }

  if (response.nextCursor) {
    nextQuery.cursor = response.nextCursor
    return nextQuery
  }

  const currentPage = typeof nextQuery.page === 'number' ? nextQuery.page : response.page
  const limit = typeof nextQuery.limit === 'number' ? nextQuery.limit : response.limit

  if (typeof currentPage === 'number' && typeof limit === 'number') {
    nextQuery.page = currentPage + 1
    nextQuery.limit = limit
    return nextQuery
  }

  return undefined
}
