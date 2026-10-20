import { buildInstructions, CHAT_LIMITS } from './chatPolicy.mjs'

export class ChatServiceError extends Error {
  constructor(kind, message, details = {}) {
    super(message)
    this.name = 'ChatServiceError'
    this.kind = kind
    this.details = details
  }
}

function responseMetadata(result) {
  return {
    responseId: result?._request_id || result?.id || null,
    status: result?.status || null,
    incompleteReason: result?.incomplete_details?.reason || null,
    outputTokens: result?.usage?.output_tokens || 0,
    reasoningTokens: result?.usage?.output_tokens_details?.reasoning_tokens || 0,
  }
}

export async function createPortfolioReply(client, { model, messages }) {
  const request = (maxOutputTokens) => client.responses.create({
    model,
    instructions: buildInstructions(),
    input: messages,
    reasoning: { effort: 'low' },
    max_output_tokens: maxOutputTokens,
    store: false,
  })

  let result = await request(CHAT_LIMITS.maxOutputTokens)
  if (result.status === 'incomplete' && result.incomplete_details?.reason === 'max_output_tokens') {
    result = await request(CHAT_LIMITS.retryOutputTokens)
  }

  const reply = result.output_text?.trim()
  if (result.status === 'incomplete') {
    throw new ChatServiceError('incomplete', 'The model did not finish its response.', responseMetadata(result))
  }
  if (!reply) {
    throw new ChatServiceError('empty', 'The model returned no visible response.', responseMetadata(result))
  }
  return { reply, metadata: responseMetadata(result) }
}

export function safeProviderError(error) {
  if (error instanceof ChatServiceError) return { kind: error.kind, ...error.details }
  return {
    kind: 'provider',
    name: error instanceof Error ? error.name : 'UnknownError',
    status: Number.isInteger(error?.status) ? error.status : null,
    code: typeof error?.code === 'string' ? error.code : null,
    type: typeof error?.type === 'string' ? error.type : null,
    requestId: typeof error?.request_id === 'string' ? error.request_id : null,
  }
}
