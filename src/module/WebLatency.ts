import { MODULE_NAME } from '../constants'
import { PlayerList } from './PlayerList'

export interface Pong {
  userId: string
  average: number
}

export class WebLatency {
  private static readonly MIN_INTERVAL_SECONDS = 10
  private intervalId: number | undefined
  private readonly playerList = new PlayerList()

  start = () => {
    this.playerList.registerListeners()
    this.restart()
  }

  stop = () => {
    if (this.intervalId === undefined) return
    window.clearInterval(this.intervalId)
    this.intervalId = undefined
  }

  restart = () => {
    this.stop()
    this.publishLatency()
    this.intervalId = window.setInterval(this.publishLatency, this.getIntervalMilliseconds())
  }

  private getIntervalMilliseconds = () => {
    const interval = (game as Game).settings.get(MODULE_NAME, 'latencyInterval') as number
    return Math.max(interval ?? 30, WebLatency.MIN_INTERVAL_SECONDS) * 1000
  }

  private publishLatency = () => {
    const gameInstance = game as Game
    const userId = gameInstance.user?.id
    const averageLatency = (gameInstance.time as typeof gameInstance.time & {
      averageLatency?: number
    }).averageLatency

    if (!gameInstance.socket?.connected || !userId || !Number.isFinite(averageLatency)) return

    const pong: Pong = { userId, average: Math.max(0, Math.round(averageLatency ?? 0)) }
    gameInstance.socket?.emit(`module.${MODULE_NAME}`, pong)
    this.playerList.updateSelf(pong)
  }
}
