import { registerFileHandlers } from './fileHandlers'
import { registerAppHandlers } from './appHandlers'

export function registerIpcHandlers(): void {
  registerFileHandlers()
  registerAppHandlers()
}
