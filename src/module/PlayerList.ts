import * as styles from '../style.module.css'
import { MODULE_NAME } from '../constants'

import type { Pong } from './WebLatency'

interface LatencyTimes {
  [key: string]: number
}

export class PlayerList {
  private playerLatencyTimes: LatencyTimes = {}
  private listenersRegistered = false
  private playersRoot: HTMLElement | null = null

  getId = (id: string) => `userLatencyText--${id}`

  registerListeners = () => {
    if (this.listenersRegistered) return
    this.listenersRegistered = true

    game.socket?.on(`module.${MODULE_NAME}`, (data: Pong) => {
      this.playerLatencyTimes[data.userId] = data.average
      this.updateLatencyText(data.userId)
    })

    Hooks.on('renderPlayers', (players: { element?: HTMLElement }) => {
      this.playersRoot = players.element ?? document.getElementById('players')
      this.refreshAll()
    })
  }

  updateSelf = (data: Pong) => {
    this.playerLatencyTimes[data.userId] = data.average
    this.updateLatencyText(data.userId)
  }

  updateLatencyText = (playerId: string) => {
    const gameInstance = game as Game

    const playerLatency = this.playerLatencyTimes[playerId]
    const hideLatency = gameInstance.settings.get(MODULE_NAME, 'hideLatency')
    const elmId = this.getId(playerId)
    const elm =
      (document.getElementById(elmId) as HTMLSpanElement) ?? this.makeLatencySpan(playerId)

    if (!elm) return

    elm.className = ''

    if (playerLatency === undefined || hideLatency) {
      elm.classList.add(styles.userSpanHidden)
      elm.setAttribute('aria-hidden', 'true')
      return
    }

    elm.removeAttribute('aria-hidden')

    const level = this.getLatencyLevel(playerLatency)
    const microLatency = gameInstance.settings.get(MODULE_NAME, 'microLatency')

    if (microLatency) {
      elm.textContent = level === styles.userSpanGood ? '+' : level === styles.userSpanLow ? '•' : '−'
      elm.title = `${playerLatency}ms`
      elm.setAttribute('aria-label', `${playerLatency}ms`)
      elm.classList.remove(styles.userSpan)
      elm.classList.add(styles.microLatency)
    } else {
      elm.removeAttribute('title')
      elm.removeAttribute('aria-label')
      elm.classList.remove(styles.microLatency)
      elm.classList.add(styles.userSpan)

      // ⚡ Optimization: Reuse existing <em> node to avoid DOM element creation & GC on every latency update
      let unit = elm.querySelector('em')
      if (!unit) {
        unit = document.createElement('em')
        unit.textContent = 'ms'
      }
      elm.replaceChildren(`${playerLatency}`, unit)
    }

    elm.classList.add(level)
  }

  getLatencyLevel = (playerLatency: number) => {
    if (playerLatency <= 100) return styles.userSpanGood
    if (playerLatency < 250) return styles.userSpanLow
    return styles.userSpanBad
  }

  makeLatencySpan = (playerId: string) => {
    const players = this.playersRoot ?? document.getElementById('players')

    if (!players) return null

    const playerElm = players.querySelector(`li[data-user-id="${playerId}"] .player-name`)

    // ⚡ Optimization: Return early if player element is not in DOM to avoid creating orphan elements & unnecessary DOM operations
    if (!playerElm) return null

    const span = document.createElement('span')
    span.id = this.getId(playerId)
    playerElm.insertAdjacentElement('afterend', span)

    return span
  }

  private refreshAll = () => {
    for (const playerId of Object.keys(this.playerLatencyTimes)) {
      this.updateLatencyText(playerId)
    }
  }
}
