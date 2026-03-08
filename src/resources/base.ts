import { Page, normalizeListResponse, resolveNextQuery } from '../pagination.js'
import type { QueryParams, RequestOptions } from '../types.js'
import type { Ikawaari } from '../client.js'

export abstract class BaseResource {
  protected readonly client: Ikawaari

  constructor(client: Ikawaari) {
    this.client = client
  }

  protected async get<T>(path: string, query?: QueryParams, options?: RequestOptions): Promise<T> {
    const response = await this.client.request<T>('GET', path, undefined, {
      ...options,
      query: query ?? options?.query
    })
    return response.data
  }

  protected async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.client.request<T>('POST', path, body, options)
    return response.data
  }

  protected async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.client.request<T>('PATCH', path, body, options)
    return response.data
  }

  protected async createPage<T>(path: string, query?: QueryParams, options?: RequestOptions): Promise<Page<T>> {
    const load = async (currentQuery?: QueryParams): Promise<Page<T>> => {
      const response = await this.client.request<unknown>('GET', path, undefined, {
        ...options,
        query: currentQuery
      })

      const normalized = normalizeListResponse<T>(response.data)
      const nextQuery = resolveNextQuery(currentQuery, normalized)

      return new Page(
        normalized,
        nextQuery ? async () => load(nextQuery) : undefined
      )
    }

    return load(query)
  }
}
