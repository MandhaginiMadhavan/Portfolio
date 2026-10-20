import { config as loadEnvironment } from 'dotenv'
import express from 'express'
import OpenAI from 'openai'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRateLimiter, validateChatRequest } from './chatPolicy.mjs'
import { ChatServiceError, createPortfolioReply, safeProviderError } from './chatService.mjs'

const directory = path.dirname(fileURLToPath(import.meta.url))
loadEnvironment({ path: path.resolve(directory, '../.env'), quiet: true })

const app = express()
const port = Number(process.env.PORT || 8787)
const trustProxy = process.env.TRUST_PROXY === 'true'
const model = process.env.OPENAI_MODEL || 'gpt-5-mini'
const rateLimit = createRateLimiter()
const distDirectory = path.resolve(directory, '../dist')

if (trustProxy) app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(express.json({ limit: '20kb' }))

app.use((_, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff')
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

app.post('/api/chat', async (request, response) => {
  const rate = rateLimit(request.ip || request.socket.remoteAddress || 'unknown')
  response.setHeader('X-RateLimit-Remaining', String(rate.remaining))
  if (!rate.allowed) {
    response.setHeader('Retry-After', String(Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1_000))))
    return response.status(429).json({ error: 'Too many messages. Please wait a moment and try again.' })
  }

  const validated = validateChatRequest(request.body)
  if (!validated.ok) return response.status(400).json({ error: validated.error })
  if (!process.env.OPENAI_API_KEY) {
    return response.status(503).json({ error: 'The AI assistant is not configured yet. Please try again later.' })
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const { reply } = await createPortfolioReply(client, { model, messages: validated.messages })
    return response.json({ reply })
  } catch (error) {
    console.error('Portfolio assistant request failed:', safeProviderError(error))
    if (error instanceof ChatServiceError && error.kind === 'incomplete') {
      return response.status(503).json({ error: 'The assistant could not finish that answer. Please try once more.' })
    }
    return response.status(502).json({ error: 'I could not reach the AI service just now. Please try again shortly.' })
  }
})

app.use(express.static(distDirectory, { index: false }))
app.use((request, response, next) => {
  if (request.method !== 'GET') return next()
  return response.sendFile(path.join(distDirectory, 'index.html'))
})

app.listen(port, () => {
  console.log(`Portfolio server listening on http://localhost:${port}`)
  console.log(`AI configuration: OPENAI_API_KEY ${process.env.OPENAI_API_KEY ? 'detected' : 'not detected'}`)
})

