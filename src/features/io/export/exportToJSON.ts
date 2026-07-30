import type { Scene } from '@/features/elements/types'
import { CANVAS_BACKGROUND, SCENE_SCHEMA_VERSION } from '@/shared/constants'
import { useWhiteboardStore } from '@/store'

import { downloadBlob } from './downloadBlob'

export function exportToJSON(): void {
  const state = useWhiteboardStore.getState()
  const scene: Scene = {
    schemaVersion: SCENE_SCHEMA_VERSION,
    elements: state.elements,
    appState: {
      zoom: state.zoom,
      scrollX: state.scrollX,
      scrollY: state.scrollY,
      gridEnabled: state.gridEnabled,
      backgroundColor: CANVAS_BACKGROUND,
    },
  }
  const blob = new Blob([JSON.stringify(scene, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `whiteboard-${Date.now()}.json`)
}
