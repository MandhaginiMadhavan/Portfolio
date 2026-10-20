export type MessageBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'ordered-list'; items: string[] }

export function parseMessageBlocks(text: string): MessageBlock[] {
  const normalisedText = text.replace(/(?:&#x20;|&#32;|&nbsp;)/gi, ' ')
  const blocks: MessageBlock[] = []
  let paragraph: string[] = []
  let list: Extract<MessageBlock, { type: 'unordered-list' | 'ordered-list' }> | null = null

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'paragraph', text: paragraph.join('\n') })
    paragraph = []
  }
  const flushList = () => {
    if (list) blocks.push(list)
    list = null
  }

  for (const line of normalisedText.replace(/\r\n?/g, '\n').split('\n')) {
    if (!line.trim()) {
      flushParagraph()
      flushList()
      continue
    }

    const heading = line.match(/^#{1,4}\s+(.+)$/)
    if (heading) {
      flushParagraph()
      flushList()
      blocks.push({ type: 'heading', text: heading[1] })
      continue
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.+)$/)
    const unordered = line.match(/^\s*[-*•]\s+(.+)$/)
    if (ordered || unordered) {
      flushParagraph()
      const type = ordered ? 'ordered-list' : 'unordered-list'
      if (!list || list.type !== type) {
        flushList()
        list = { type, items: [] }
      }
      const activeList = list as Extract<MessageBlock, { type: 'unordered-list' | 'ordered-list' }>
      activeList.items.push((ordered ?? unordered)![1])
      continue
    }

    flushList()
    paragraph.push(line)
  }

  flushParagraph()
  flushList()
  return blocks
}
