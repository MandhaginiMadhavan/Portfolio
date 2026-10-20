export type ChatHistoryMessage = {
  id: string
  role: 'assistant' | 'visitor'
  text: string
  isError?: boolean
}

type ApiMessage = { role: 'user' | 'assistant'; content: string }

const maximumHistoryMessages = 13
const maximumHistoryCharacters = 24_000

export function buildConversationHistory(messages: ChatHistoryMessage[]): ApiMessage[] {
  const turns: ApiMessage[][] = []

  for (let index = 0; index < messages.length; index += 1) {
    const message = messages[index]
    if (message.id === 'welcome' || message.role !== 'visitor') continue

    const assistant = messages[index + 1]
    if (assistant?.role === 'assistant' && !assistant.isError) {
      turns.push([
        { role: 'user', content: message.text },
        { role: 'assistant', content: assistant.text },
      ])
      index += 1
    } else if (!assistant) {
      turns.push([{ role: 'user', content: message.text }])
    } else if (assistant.isError) {
      index += 1
    }
  }

  const selected: ApiMessage[][] = []
  let messageCount = 0
  let characterCount = 0
  for (let index = turns.length - 1; index >= 0; index -= 1) {
    const turn = turns[index]
    const turnCharacters = turn.reduce((total, message) => total + message.content.length, 0)
    if (selected.length > 0 && (messageCount + turn.length > maximumHistoryMessages || characterCount + turnCharacters > maximumHistoryCharacters)) break
    selected.unshift(turn)
    messageCount += turn.length
    characterCount += turnCharacters
  }

  return selected.flat()
}
