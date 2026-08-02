import { registerSettings } from './module/Settings'
import { WebLatency } from './module/WebLatency'
import { SETTINGS_CHANGED_HOOK } from './constants'

Hooks.once('init', () => {
  registerSettings()
})

Hooks.once('ready', () => {
  const webLatency = new WebLatency()
  webLatency.start()
  Hooks.on(SETTINGS_CHANGED_HOOK, () => webLatency.restart())
})
