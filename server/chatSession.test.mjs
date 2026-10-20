import assert from 'node:assert/strict'
import test from 'node:test'
import { chatWelcomeMessage, createInitialChatMessages, parseChatSession } from '../src/chatSession.ts'

test('uses the approved welcome message for a new or reset conversation', () => {
  assert.equal(createInitialChatMessages()[0].text, chatWelcomeMessage)
  assert.equal(chatWelcomeMessage, "Hi there! 👋 I'm Mandhagini's AI assistant. Ask me anything about her work, projects, skills, or experience!")
  assert.deepEqual(parseChatSession(null), createInitialChatMessages())
})

test('preserves messages from a legacy session while ignoring its mode preference', () => {
  const messages = [
    { id: 'welcome', role: 'assistant', text: chatWelcomeMessage },
    { id: 'visitor-1', role: 'visitor', text: 'What is InsightForge?' },
    { id: 'assistant-1', role: 'assistant', text: 'A concise verified answer.' },
  ]
  const restored = parseChatSession(JSON.stringify({ mode: 'friendly', messages }))
  assert.deepEqual(restored, messages)
})

test('falls back safely when saved session data is invalid', () => {
  assert.deepEqual(parseChatSession('{not json'), createInitialChatMessages())
  assert.deepEqual(parseChatSession(JSON.stringify({ mode: 'professional' })), createInitialChatMessages())
})
