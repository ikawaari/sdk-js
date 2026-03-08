import test from 'node:test'
import assert from 'node:assert/strict'
import {createHmac} from 'node:crypto'
import {constructWebhookEvent, parseSignatureHeader, parseWebhookEvent, verifyWebhookSignature} from '../dist/webhooks.js'

function sign(payload, timestamp, secret) {
  return createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex')
}

test('parseSignatureHeader extracts timestamp and signatures', () => {
  const header = 't=1710000000,v1=abc123,v1=def456'
  const parsed = parseSignatureHeader(header)

  assert.equal(parsed.timestamp, 1710000000)
  assert.deepEqual(parsed.signatures, ['abc123', 'def456'])
})

test('verifyWebhookSignature accepts a valid signature', () => {
  const payload = JSON.stringify({ id: 'evt_123', type: 'payment_intent.succeeded', data: { object: { id: 'pi_123' } } })
  const timestamp = Math.floor(Date.now() / 1000)
  const secret = 'whsec_test_secret'
  const signature = sign(payload, timestamp, secret)
  const header = `t=${timestamp},v1=${signature}`

  assert.equal(verifyWebhookSignature(payload, header, secret), true)
})

test('constructWebhookEvent rejects invalid signatures', () => {
  const payload = JSON.stringify({ id: 'evt_123', type: 'payment_intent.succeeded', data: { object: { id: 'pi_123' } } })
  const timestamp = Math.floor(Date.now() / 1000)
  const header = `t=${timestamp},v1=invalid`

  assert.throws(() => constructWebhookEvent(payload, header, 'whsec_test_secret'))
})

test('parseWebhookEvent returns the event payload', () => {
  const payload = JSON.stringify({ id: 'evt_123', type: 'payment_intent.succeeded', data: { object: { id: 'pi_123' } } })
  const event = parseWebhookEvent(payload)

  assert.equal(event.id, 'evt_123')
  assert.equal(event.type, 'payment_intent.succeeded')
})
