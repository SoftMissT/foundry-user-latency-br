import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const index = await readFile('src/index.ts', 'utf8')
const latency = await readFile('src/module/WebLatency.ts', 'utf8')
const players = await readFile('src/module/PlayerList.ts', 'utf8')

test('uses Foundry v14 lifecycle and native latency measurement', () => {
  assert.match(index, /Hooks\.once\('init'/)
  assert.match(index, /Hooks\.once\('ready'/)
  assert.match(latency, /averageLatency/)
  assert.doesNotMatch(latency, /time\.sync\(/)
})

test('updates the ApplicationV2 Players list safely', () => {
  assert.match(players, /Hooks\.on\('renderPlayers'/)
  assert.match(players, /textContent/)
  assert.doesNotMatch(players, /innerHTML/)
})

test('production source has no console logging', () => {
  assert.doesNotMatch(`${index}\n${latency}\n${players}`, /console\.(?:log|error)/)
})
