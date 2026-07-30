import { useWhiteboardStore } from '@/store'

import { downloadBlob } from './downloadBlob'
import { renderSceneToCanvas } from './renderSceneToCanvas'

export async function exportToJPEG(): Promise<void> {
  const canvas = await renderSceneToCanvas(useWhiteboardStore.getState().elements, '#ffffff')
  canvas.toBlob(
    (blob) => {
      if (blob) downloadBlob(blob, `whiteboard-${Date.now()}.jpeg`)
    },
    'image/jpeg',
    0.92,
  )
}
