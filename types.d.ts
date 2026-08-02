declare module '*.module.css' {
  const classes: Record<string, string>
  export = classes
}

interface ModuleSocket {
  connected: boolean
  on(event: string, listener: (data: any) => void): void
  emit(event: string, data: unknown): void
}

interface Game {
  i18n: {
    localize(key: string): string
  }
  settings: {
    get(moduleId: string, key: string): unknown
    register(moduleId: string, key: string, config: Record<string, unknown>): void
  }
  socket: ModuleSocket | null
  time: {
    averageLatency: number
  }
  user: {
    id: string
  } | null
}

declare const game: Game

declare const Hooks: {
  once(hook: string, listener: (...args: any[]) => void): number
  on(hook: string, listener: (...args: any[]) => void): number
  callAll(hook: string, ...args: any[]): void
}
