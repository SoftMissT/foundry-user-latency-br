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

    if (playerLatency === undefined || hideLatency) {
      elm.className = styles.userSpanHidden
      return
    }

    const level = this.getLatencyLevel(playerLatency)
    const microLatency = gameInstance.settings.get(MODULE_NAME, 'microLatency')

    if (microLatency) {
      // Batch class updates to prevent multiple DOM recalculations
      elm.className = `${styles.microLatency} ${level}`
      elm.textContent = level === styles.userSpanGood ? '+' : level === styles.userSpanLow ? '•' : '−'
      elm.title = `${playerLatency}ms`
    } else {
      // Batch class updates to prevent multiple DOM recalculations
      elm.className = `${styles.userSpan} ${level}`
      elm.removeAttribute('title')

      // Optimization: reuse existing Text and <em> nodes to avoid garbage collection
      // overhead from document.createElement('em') on every latency update cycle.
      const textNode = elm.firstChild
      const unit = elm.querySelector('em')
      if (textNode && textNode.nodeType === Node.TEXT_NODE && unit) {
        textNode.nodeValue = `${playerLatency}`
      } else {
        elm.textContent = `${playerLatency}`
        const newUnit = document.createElement('em')
        newUnit.textContent = 'ms'
        elm.append(newUnit)
      }
    }
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

    // Don't create orphaned HTML elements if the target player element doesn't exist
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
