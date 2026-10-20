import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { clearPendingPortfolioReturn, hasPendingPortfolioReturn, returnToPortfolioHome } from '../src/projectNavigation.ts'

test('project return skips the intro once and navigates to the homepage root', () => {
  const values = new Map()
  let destination = ''
  const previousWindow = globalThis.window
  globalThis.window = {
    sessionStorage: {
      getItem: (key) => values.get(key) ?? null,
      removeItem: (key) => values.delete(key),
      setItem: (key, value) => values.set(key, value),
    },
    location: { assign: (value) => { destination = value } },
  }

  try {
    returnToPortfolioHome()
    assert.equal(destination, '/')
    assert.equal(hasPendingPortfolioReturn(), true)
    assert.equal(hasPendingPortfolioReturn(), true)
    clearPendingPortfolioReturn()
    assert.equal(hasPendingPortfolioReturn(), false)
  } finally {
    globalThis.window = previousWindow
  }
})

test('all four project pages use the shared homepage return handler', async () => {
  const pagePaths = [
    'src/pages/InsightForgePage.tsx',
    'src/pages/TimeSyncPage.tsx',
    'src/pages/PersonaMultiplierPage.tsx',
    'src/pages/WildfireDetectionPage.tsx',
  ]

  for (const pagePath of pagePaths) {
    const source = await readFile(pagePath, 'utf8')
    assert.match(source, /href="\/" onClick=\{\(event\) => \{ event\.preventDefault\(\); returnToPortfolioHome\(\) \}\}/)
    assert.doesNotMatch(source, /href="\/#projects"[^\n]*Back to portfolio/)
  }
})
