import assert from 'node:assert/strict'
import test from 'node:test'
import { ChatServiceError, createPortfolioReply, safeProviderError } from './chatService.mjs'

function clientWith(results, captured = []) {
  let index = 0
  return {
    captured,
    responses: {
      create: async (request) => {
        captured.push(request)
        const result = results[index++]
        if (result instanceof Error) throw result
        return result
      },
    },
  }
}

test('passes complete multi-turn history and requests low reasoning effort', async () => {
  const captured = []
  const client = clientWith([{ status: 'completed', output_text: 'Here is a draft.', usage: {} }], captured)
  const messages = [
    { role: 'user', content: 'How can I contact Mandhagini?' },
    { role: 'assistant', content: 'Her verified email is mandhagini23@gmail.com. I can draft a message.' },
    { role: 'user', content: 'Yes, please draft it.' },
  ]
  const result = await createPortfolioReply(client, { model: 'configured-model', messages })
  assert.equal(result.reply, 'Here is a draft.')
  assert.deepEqual(captured[0].input, messages)
  assert.deepEqual(captured[0].reasoning, { effort: 'low' })
})

test('returns a complete long answer without trimming it', async () => {
  const longAnswer = `${'Technical explanation. '.repeat(90)}Complete.`
  const client = clientWith([{ status: 'completed', output_text: longAnswer, usage: {} }])
  const result = await createPortfolioReply(client, { model: 'configured-model', messages: [{ role: 'user', content: 'Explain the architecture in detail.' }] })
  assert.equal(result.reply, longAnswer)
  assert.match(result.reply, /Complete\.$/)
})

test('retries an output-token incomplete response with a larger allowance', async () => {
  const captured = []
  const client = clientWith([
    { status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' }, output_text: '', usage: { output_tokens: 1_200, output_tokens_details: { reasoning_tokens: 1_200 } } },
    { status: 'completed', output_text: 'A complete answer after retry.', usage: {} },
  ], captured)
  const result = await createPortfolioReply(client, { model: 'configured-model', messages: [{ role: 'user', content: 'Explain InsightForge.' }] })
  assert.equal(result.reply, 'A complete answer after retry.')
  assert.equal(captured.length, 2)
  assert.ok(captured[1].max_output_tokens > captured[0].max_output_tokens)
})

test('never returns a visibly partial response after the retry is incomplete', async () => {
  const client = clientWith([
    { status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' }, output_text: 'Partial first', usage: {} },
    { status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' }, output_text: 'Partial second', usage: {} },
  ])
  await assert.rejects(
    createPortfolioReply(client, { model: 'configured-model', messages: [{ role: 'user', content: 'Detailed question' }] }),
    (error) => error instanceof ChatServiceError && error.kind === 'incomplete',
  )
})

test('preserves safe API failure metadata without request content', async () => {
  const providerError = Object.assign(new Error('Billing limit reached'), { status: 429, code: 'rate_limit_exceeded', type: 'requests', request_id: 'req_test' })
  const client = clientWith([providerError])
  await assert.rejects(createPortfolioReply(client, { model: 'configured-model', messages: [{ role: 'user', content: 'Hello' }] }))
  assert.deepEqual(safeProviderError(providerError), { kind: 'provider', name: 'Error', status: 429, code: 'rate_limit_exceeded', type: 'requests', requestId: 'req_test' })
})
