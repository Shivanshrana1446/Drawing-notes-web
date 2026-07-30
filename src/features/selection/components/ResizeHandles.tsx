import type { PointerEvent as ReactPointerEvent } from 'react'

import { worldToScreen } from '@/features/canvas/utils/coordinateTransform'
import type { ResizeHandle } from '@/features/elements/geometry'
import { RESIZE_HANDLES, resizeBoxElement, resizeLineEndpoint } from '@/features/elements/geometry'
import type {
  ImageElement,
  ShapeElement,
  TextElement,
  WhiteboardElement,
} from '@/features/elements/types'
import type { Point } from '@/shared/types/common'
import { useWhiteboardStore } from '@/store'

interface ResizeHandlesProps {
  element: WhiteboardElement
  getContainerRect: () => DOMRect
}

const HANDLE_SIZE = 8
/** Hit target is larger than the visible dot so handles are draggable on touchscreens. */
const HANDLE_HIT_SIZE = 28

const CURSOR_BY_HANDLE: Record<ResizeHandle, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
}

/** Box elements (rectangle, circle, text, image) get 8 handles; lines/arrows get 2 endpoint handles; freehand strokes get none. */
export function ResizeHandles({ element, getContainerRect }: ResizeHandlesProps) {
  const zoom = useWhiteboardStore((state) => state.zoom)
  const scrollX = useWhiteboardStore((state) => state.scrollX)
  const scrollY = useWhiteboardStore((state) => state.scrollY)
  const commit = useWhiteboardStore((state) => state.commit)
  const updateElement = useWhiteboardStore((state) => state.updateElement)

  const viewport = { zoom, scrollX, scrollY }

  function toWorld(event: ReactPointerEvent): Point {
    const rect = getContainerRect()
    return {
      x: (event.clientX - rect.left) / zoom + scrollX,
      y: (event.clientY - rect.top) / zoom + scrollY,
    }
  }

  function handleDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    event.stopPropagation()
    event.currentTarget.setPointerCapture(event.pointerId)
    commit()
  }

  if (element.type === 'pencil' || element.type === 'brush') return null

  if (element.type === 'line' || element.type === 'arrow') {
    return (
      <>
        {element.points.map((point, index) => {
          const screenPoint = worldToScreen(point, viewport)
          return (
            <div
              key={index}
              onPointerDown={handleDragStart}
              onPointerMove={(event) => {
                if (event.buttons === 0) return
                updateElement(
                  element.id,
                  resizeLineEndpoint(element, index as 0 | 1, toWorld(event)),
                )
              }}
              className="pointer-events-auto absolute flex cursor-move items-center justify-center"
              style={{
                left: screenPoint.x - HANDLE_HIT_SIZE / 2,
                top: screenPoint.y - HANDLE_HIT_SIZE / 2,
                width: HANDLE_HIT_SIZE,
                height: HANDLE_HIT_SIZE,
              }}
            >
              <div
                className="rounded-full border-2 border-accent bg-white"
                style={{ width: HANDLE_SIZE, height: HANDLE_SIZE }}
              />
            </div>
          )
        })}
      </>
    )
  }

  const boxElement = element as ShapeElement | TextElement | ImageElement
  const topLeft = worldToScreen({ x: boxElement.x, y: boxElement.y }, viewport)
  const bottomRight = worldToScreen(
    { x: boxElement.x + boxElement.width, y: boxElement.y + boxElement.height },
    viewport,
  )
  const midX = (topLeft.x + bottomRight.x) / 2
  const midY = (topLeft.y + bottomRight.y) / 2

  const handlePositions: Record<ResizeHandle, Point> = {
    nw: { x: topLeft.x, y: topLeft.y },
    n: { x: midX, y: topLeft.y },
    ne: { x: bottomRight.x, y: topLeft.y },
    e: { x: bottomRight.x, y: midY },
    se: { x: bottomRight.x, y: bottomRight.y },
    s: { x: midX, y: bottomRight.y },
    sw: { x: topLeft.x, y: bottomRight.y },
    w: { x: topLeft.x, y: midY },
  }

  return (
    <>
      {RESIZE_HANDLES.map((handle) => {
        const position = handlePositions[handle]
        return (
          <div
            key={handle}
            onPointerDown={handleDragStart}
            onPointerMove={(event) => {
              if (event.buttons === 0) return
              updateElement(element.id, resizeBoxElement(boxElement, handle, toWorld(event)))
            }}
            className="pointer-events-auto absolute flex items-center justify-center"
            style={{
              left: position.x - HANDLE_HIT_SIZE / 2,
              top: position.y - HANDLE_HIT_SIZE / 2,
              width: HANDLE_HIT_SIZE,
              height: HANDLE_HIT_SIZE,
              cursor: CURSOR_BY_HANDLE[handle],
            }}
          >
            <div
              className="border-2 border-accent bg-white"
              style={{ width: HANDLE_SIZE, height: HANDLE_SIZE }}
            />
          </div>
        )
      })}
    </>
  )
}
