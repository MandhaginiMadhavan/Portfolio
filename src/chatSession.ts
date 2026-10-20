import type { ChatHistoryMessage } from './chatHistory'

export const chatWelcomeMessage = "Hi there! 👋 I'm Mandhagini's AI assistant. Ask me anything about her work, projects, skills, or experience!"

export function createInitialChatMessages(): ChatHistoryMessage[] {
  return [{ id: 'welcome', role: 'assistant', text: chatWelcomeMessage }]
}

export function parseChatSession(raw: string | null): ChatHistoryMessage[] {
  if (!raw) return createInitialChatMessages()

  try {
    // Older sessions may include a `mode` property. It is intentionally ignored.
    const parsed = JSON.parse(raw) as { messages?: unknown }
    if (!Array.isArray(parsed.messages)) return createInitialChatMessages()

    const messages = parsed.messages.filter((message): message is ChatHistoryMessage => {
      if (!message || typeof message !== 'object') return false
      const candidate = message as Partial<ChatHistoryMessage>
      return typeof candidate.id === 'string'
        && (candidate.role === 'assistant' || candidate.role === 'visitor')
        && typeof candidate.text === 'string'
        && candidate.text.length <= 16_000
    }).slice(-40)

    return messages.length ? messages : createInitialChatMessages()
  } catch {
    return createInitialChatMessages()
  }
}
