import type { MoraApi } from './ipc'

declare global {
  interface Window {
    mora: MoraApi
  }
}

export {}
