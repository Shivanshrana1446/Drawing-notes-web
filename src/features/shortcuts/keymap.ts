import type { ToolType } from '@/features/tools/types'

/** Single source of truth for tool keyboard shortcuts — used by both the Toolbar labels and the global key handler. */
export const TOOL_SHORTCUTS: Record<string, ToolType> = {
  v: 'select',
  h: 'move',
  p: 'pencil',
  b: 'brush',
  e: 'eraser',
  r: 'rectangle',
  o: 'circle',
  l: 'line',
  a: 'arrow',
  t: 'text',
  d: 'delete',
}

export function getShortcutLabel(tool: ToolType): string | undefined {
  const entry = Object.entries(TOOL_SHORTCUTS).find(([, value]) => value === tool)
  return entry ? entry[0].toUpperCase() : undefined
}
