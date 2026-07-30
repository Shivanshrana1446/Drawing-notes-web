import { worldToScreen } from '@/features/canvas/utils/coordinateTransform'
import { useWhiteboardStore } from '@/store'

import { getSelectionBounds } from '../utils/selectionBounds'
import { ResizeHandles } from './ResizeHandles'

interface SelectionOverlayProps {
  getContainerRect: () => DOMRect
}

export function SelectionOverlay({ getContainerRect }: SelectionOverlayProps) {
  const elements = useWhiteboardStore((state) => state.elements)
  const selectedIds = useWhiteboardStore((state) => state.selectedIds)
  const zoom = useWhiteboardStore((state) => state.zoom)
  const scrollX = useWhiteboardStore((state) => state.scrollX)
  const scrollY = useWhiteboardStore((state) => state.scrollY)

  const bounds = getSelectionBounds(elements, selectedIds)
  if (!bounds) return null

  const viewport = { zoom, scrollX, scrollY }
  const topLeft = worldToScreen({ x: bounds.minX, y: bounds.minY }, viewport)
  const bottomRight = worldToScreen({ x: bounds.maxX, y: bounds.maxY }, viewport)
  const singleElement =
    selectedIds.length === 1 ? elements.find((element) => element.id === selectedIds[0]) : undefined

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="pointer-events-none absolute border-2 border-accent"
        style={{
          left: topLeft.x,
          top: topLeft.y,
          width: bottomRight.x - topLeft.x,
          height: bottomRight.y - topLeft.y,
        }}
      />
      {singleElement && (
        <ResizeHandles element={singleElement} getContainerRect={getContainerRect} />
      )}
    </div>
  )
}
