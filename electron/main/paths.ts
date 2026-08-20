import { app } from 'electron'
import { join } from 'node:path'

export function appAssetPath(...segments: string[]): string {
  const appRoot = app.isPackaged ? app.getAppPath() : process.cwd()
  return join(appRoot, ...segments)
}

export function appIconPath(): string {
  return appAssetPath('build', 'icon.ico')
}
