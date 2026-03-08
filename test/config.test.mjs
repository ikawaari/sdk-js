import test from 'node:test'
import assert from 'node:assert/strict'
import {normalizeBaseUrl, resolveClientOptions} from '../dist/config.js'
import Ikawaari from '../dist/index.js'

test('normalizeBaseUrl trims trailing slash', () => {
  assert.equal(normalizeBaseUrl('https://api.ikawaari.com/'), 'https://api.ikawaari.com')
})

test('resolveClientOptions preserves configured auth and defaults', () => {
  const options = resolveClientOptions({
    baseUrl: 'https://sandbox.ikawaari.local/',
    apiKey: 'ik_test_123',
    headers: { 'X-Test': '1' },
    fetch: async () => new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
  })

  assert.equal(options.baseUrl, 'https://sandbox.ikawaari.local')
  assert.equal(options.apiKey, 'ik_test_123')
  assert.equal(options.environment, 'sandbox')
  assert.equal(options.headers['X-Test'], '1')
  assert.equal(options.maxNetworkRetries, 2)
})

test('Ikawaari client exposes top-level resources', () => {
  const client = new Ikawaari({
    baseUrl: 'https://sandbox.ikawaari.local',
    apiKey: 'ik_test_123',
    fetch: async () => new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
  })

  assert.ok(client.payments)
  assert.ok(client.webhooks)
  assert.ok(client.merchant)
})
