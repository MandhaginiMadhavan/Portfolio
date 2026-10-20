import assert from 'node:assert/strict'
import test from 'node:test'
import { parseMessageBlocks } from '../src/messageFormatting.ts'

test('preserves paragraph boundaries between project sections', () => {
  const blocks = parseMessageBlocks('InsightForge is a working prototype.\nIt supports investigations.\n\nTimeSync AI validates clip boundaries.\n\nPersona Multiplier creates three messages.')
  assert.deepEqual(blocks, [
    { type: 'paragraph', text: 'InsightForge is a working prototype.\nIt supports investigations.' },
    { type: 'paragraph', text: 'TimeSync AI validates clip boundaries.' },
    { type: 'paragraph', text: 'Persona Multiplier creates three messages.' },
  ])
})

test('recognises Markdown headings and keeps related list items together', () => {
  const blocks = parseMessageBlocks('### Projects\n\n1. **InsightForge** — investigation platform\n2. **TimeSync AI** — timestamp validation\n\n- Verified facts only\n- Prototype boundaries retained')
  assert.deepEqual(blocks, [
    { type: 'heading', text: 'Projects' },
    { type: 'ordered-list', items: ['**InsightForge** — investigation platform', '**TimeSync AI** — timestamp validation'] },
    { type: 'unordered-list', items: ['Verified facts only', 'Prototype boundaries retained'] },
  ])
})

test('keeps long links and surrounding text in the same paragraph', () => {
  const text = 'GitHub: https://github.com/MandhaginiMadhavan/InsightForge and email: mailto:mandhagini23@gmail.com'
  assert.deepEqual(parseMessageBlocks(text), [{ type: 'paragraph', text }])
})

test('removes visible whitespace entities without changing paragraph structure', () => {
  assert.deepEqual(parseMessageBlocks('**Role — 2025** &#x20;\nShe developed the project.\n\nNext role&nbsp;'), [
    { type: 'paragraph', text: '**Role — 2025**  \nShe developed the project.' },
    { type: 'paragraph', text: 'Next role ' },
  ])
})
