import { RotateCcw, Send, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { buildConversationHistory, type ChatHistoryMessage } from '../chatHistory'
import { createInitialChatMessages, parseChatSession } from '../chatSession'
import { parseMessageBlocks } from '../messageFormatting'

type Message = ChatHistoryMessage

const greeting = 'Hello! 👋 How can I help?'
const sessionKey = 'mandhagini-portfolio-chat-v1'
export const openPortfolioAssistantEvent = 'portfolio-assistant:open'

function readChatSession(): { messages: Message[] } {
  try {
    return { messages: parseChatSession(window.sessionStorage.getItem(sessionKey)) }
  } catch {
    return { messages: createInitialChatMessages() }
  }
}

function InlineContent({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*\n]+\*\*|(?:https?:\/\/|mailto:)[^\s]+)/g)
  return <>{parts.map((part, index) => {
    if (/^\*\*[^*\n]+\*\*$/.test(part)) return <strong key={index} className="font-semibold text-white/90">{part.slice(2, -2)}</strong>
    if (!/^(?:https?:\/\/|mailto:)/i.test(part)) return <span key={index}>{part}</span>
    const trailing = part.match(/[),.;!?]+$/)?.[0] ?? ''
    const href = trailing ? part.slice(0, -trailing.length) : part
    try {
      const url = new URL(href)
      if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) return <span key={index}>{part}</span>
    } catch {
      return <span key={index}>{part}</span>
    }
    return <span key={index}><a href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'} className="break-all text-violet underline decoration-violet/40 underline-offset-2 hover:text-gold">{href}</a>{trailing}</span>
  })}</>
}

function MessageContent({ text }: { text: string }) {
  const blocks = parseMessageBlocks(text)
  return <div className="space-y-3.5">{blocks.map((block, index) => {
    if (block.type === 'heading') return <h3 key={index} className="pt-0.5 font-display text-sm font-semibold leading-5 text-white/90"><InlineContent text={block.text} /></h3>
    if (block.type === 'ordered-list') return <ol key={index} className="ml-5 list-decimal space-y-2.5 marker:text-violet"><>{block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1"><InlineContent text={item} /></li>)}</></ol>
    if (block.type === 'unordered-list') return <ul key={index} className="ml-5 list-disc space-y-2 marker:text-violet"><>{block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1"><InlineContent text={item} /></li>)}</></ul>
    return <p key={index} className="whitespace-pre-wrap"><InlineContent text={block.text} /></p>
  })}</div>
}

export function PortfolioAssistant() {
  const [savedSession] = useState(readChatSession)
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>(savedSession.messages)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    inputRef.current?.focus()
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        requestAnimationFrame(() => triggerRef.current?.focus())
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  useEffect(() => {
    const openAssistant = () => setIsOpen(true)
    window.addEventListener(openPortfolioAssistantEvent, openAssistant)
    return () => window.removeEventListener(openPortfolioAssistantEvent, openAssistant)
  }, [])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading])

  useEffect(() => {
    try {
      window.sessionStorage.setItem(sessionKey, JSON.stringify({ messages }))
    } catch {
      // The chat still works when browser storage is unavailable.
    }
  }, [messages])

  const closePanel = () => {
    setIsOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const resetConversation = () => {
    setMessages(createInitialChatMessages())
    setDraft('')
    try { window.sessionStorage.removeItem(sessionKey) } catch { /* Storage may be unavailable. */ }
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const sendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const question = draft.trim()
    if (!question || isLoading) return

    const visitorMessage: Message = { id: crypto.randomUUID(), role: 'visitor', text: question }
    const nextMessages = [...messages, visitorMessage]
    setMessages(nextMessages)
    setDraft('')
    setIsLoading(true)

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 45_000)
    try {
      const conversation = buildConversationHistory(nextMessages)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
        signal: controller.signal,
      })
      const payload = await response.json().catch(() => ({})) as { reply?: string; error?: string }
      if (!response.ok || !payload.reply) throw new Error(payload.error || 'The assistant could not answer that message.')
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text: payload.reply! }])
    } catch (error) {
      const text = error instanceof DOMException && error.name === 'AbortError'
        ? 'That took longer than expected. Please try again.'
        : error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text, isError: true }])
    } finally {
      window.clearTimeout(timeout)
      setIsLoading(false)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }

  return (
    <aside className="fixed bottom-4 right-4 z-[70] flex max-w-[calc(100vw-2rem)] flex-col items-end sm:bottom-6 sm:right-6" aria-label="Portfolio assistant">
      {isOpen ? (
        <section id="portfolio-assistant-panel" role="dialog" aria-modal="false" aria-labelledby="assistant-title" aria-describedby="assistant-description" className="mb-3 flex h-[min(36rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-violet/25 bg-[#0b0a17]/95 shadow-[0_24px_90px_rgba(0,0,0,0.55),0_0_45px_rgba(101,116,255,0.12)] backdrop-blur-xl">
          <header className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-violet/10 to-indigo/10 px-4 py-3.5">
            <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-gold/30 bg-ink"><img src="/assets/assistant-avatar.png" alt="" className="h-full w-full scale-125 object-contain object-top" /></div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2"><h2 id="assistant-title" className="truncate font-display text-sm font-semibold text-white">Portfolio assistant</h2><span className="rounded-full border border-gold/25 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold">AI</span></div>
              <p id="assistant-description" className="mt-0.5 text-xs text-white/45">Ask me anything about Mandhagini&apos;s work!</p>
            </div>
            <button type="button" onClick={resetConversation} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet" aria-label="Start a new conversation" title="New conversation"><RotateCcw size={16} aria-hidden="true" /></button>
            <button type="button" onClick={closePanel} className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet" aria-label="Close portfolio assistant"><X size={18} aria-hidden="true" /></button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-relevant="additions">
            {messages.map((message) => <div key={message.id} className={`flex min-w-0 ${message.role === 'visitor' ? 'justify-end' : 'justify-start'}`}><div className={`min-w-0 max-w-[88%] break-words [overflow-wrap:anywhere] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${message.role === 'visitor' ? 'whitespace-pre-wrap rounded-br-sm bg-indigo text-white' : message.isError ? 'rounded-bl-sm border border-gold/25 bg-gold/[0.06] text-white/70' : 'rounded-bl-sm border border-white/10 bg-white/[0.055] text-white/70'}`}>{message.role === 'assistant' ? <MessageContent text={message.text} /> : <InlineContent text={message.text} />}</div></div>)}
            {isLoading && <div className="flex justify-start" role="status" aria-label="Assistant is preparing a response"><div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.055] px-4 py-3"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet motion-reduce:animate-none" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet [animation-delay:150ms] motion-reduce:animate-none" /><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold [animation-delay:300ms] motion-reduce:animate-none" /><span className="sr-only">Thinking…</span></div></div>}
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-white/10 bg-ink/70 p-3">
            <label htmlFor="assistant-message" className="sr-only">Message the portfolio assistant</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-1.5 focus-within:border-violet/60">
              <input ref={inputRef} id="assistant-message" value={draft} onChange={(event) => setDraft(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none" placeholder="Ask about the portfolio…" autoComplete="off" maxLength={600} disabled={isLoading} />
              <button type="submit" disabled={!draft.trim() || isLoading} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-violet to-indigo text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-35" aria-label="Send message"><Send size={17} aria-hidden="true" /></button>
            </div>
            <p className="mt-2 px-1 text-center text-[10px] leading-4 text-white/30">AI-generated responses may contain inaccuracies.</p>
          </form>
        </section>
      ) : (
        <button type="button" onClick={() => setIsOpen(true)} className="relative mb-3 mr-1 max-w-[12.5rem] rounded-2xl border border-violet/40 bg-[#15102a]/90 px-4 py-3 text-left font-display text-sm font-medium leading-5 text-white/85 shadow-[0_12px_35px_rgba(0,0,0,0.4),0_0_24px_rgba(139,92,246,0.16)] backdrop-blur-xl transition-[border-color,box-shadow] hover:border-violet/65 hover:shadow-[0_12px_35px_rgba(0,0,0,0.4),0_0_30px_rgba(139,92,246,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet sm:max-w-[13.5rem]" aria-label="Open portfolio assistant" aria-controls="portfolio-assistant-panel" aria-expanded="false">{greeting}<span className="absolute -bottom-2 right-10 h-4 w-4 rotate-45 border-b border-r border-violet/40 bg-[#15102a]/95" aria-hidden="true" /></button>
      )}

      <button ref={triggerRef} type="button" onClick={() => setIsOpen((open) => !open)} className="assistant-float relative h-24 w-24 overflow-hidden rounded-full border border-violet/35 bg-gradient-to-br from-violet/15 via-ink to-gold/10 shadow-[0_16px_45px_rgba(0,0,0,0.5),0_0_32px_rgba(101,116,255,0.2)] transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet motion-reduce:transition-none sm:h-28 sm:w-28" aria-label={isOpen ? 'Close portfolio assistant' : 'Open portfolio assistant'} aria-expanded={isOpen} aria-controls="portfolio-assistant-panel">
        <img src="/assets/assistant-avatar.png" alt="Friendly professional portfolio assistant waving" className="absolute inset-0 h-full w-full scale-[1.14] object-contain object-top" />
        <span className="absolute bottom-1.5 right-1.5 h-3.5 w-3.5 rounded-full border-2 border-ink bg-gold" aria-hidden="true" />
      </button>
    </aside>
  )
}
