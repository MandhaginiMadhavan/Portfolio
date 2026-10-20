import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldShowCinematicIntro } from '../src/introPolicy.ts'

test('plays the cinematic intro on each full page load', () => {
  assert.equal(shouldShowCinematicIntro(false), true)
})

test('skips the cinematic intro when reduced motion is preferred', () => {
  assert.equal(shouldShowCinematicIntro(true), false)
})
