import type { Scene, WhiteboardElement } from '@/features/elements/types'
import { useWhiteboardStore } from '@/store'

function isWhiteboardElement(value: unknown): value is WhiteboardElement {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.type === 'string' &&
    typeof candidate.x === 'number' &&
    typeof candidate.y === 'number' &&
    typeof candidate.width === 'number' &&
    typeof candidate.height === 'number'
  )
}

function isScene(value: unknown): value is Scene {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as Record<string, unknown>
  return (
    typeof candidate.schemaVersion === 'number' &&
    Array.isArray(candidate.elements) &&
    candidate.elements.every(isWhiteboardElement) &&
    typeof candidate.appState === 'object' &&
    candidate.appState !== null
  )
}

export async function importFromJSON(file: File): Promise<void> {
  const text = await file.text()
  const parsed: unknown = JSON.parse(text)

  if (!isScene(parsed)) {
    throw new Error('This file is not a valid whiteboard scene.')
  }

  const state = useWhiteboardStore.getState()
  state.commit()
  state.replaceElements(parsed.elements)
  state.setSelectedIds([])
  state.setEditingTextElementId(null)
  state.setViewport({
    zoom: parsed.appState.zoom,
    scrollX: parsed.appState.scrollX,
    scrollY: parsed.appState.scrollY,
    gridEnabled: parsed.appState.gridEnabled,
  })
}
