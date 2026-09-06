import type { Command } from './types'

const registry = new Map<string, Command>()

export function registerCommand(cmd: Command) {
  registry.set(cmd.name, cmd)
}

export function getCommand(name: string): Command | undefined {
  return registry.get(name)
}

export function listCommands(): Command[] {
  return [...registry.values()]
}
