import { useCallback, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'

import { measureTextBlock } from '@/features/elements/geometry'
import { renderElement } from '@/features/elements/renderers'
import type { TextElement, WhiteboardElement } from '@/features/elements/types'
import { SelectionOverlay } from '@/features/selection/components/SelectionOverlay'
import { DRAW_TOOLS, toolRegistry } from '@/features/tools/toolRegistry'
import type { DragState, ToolContext } from '@/features/tools/types'
import type { Point } from '@/shared/types/common'
import { useWhiteboardStore } from '@/store'

import { getPointerScreenPoint, screenToWorld } from '../utils/coordinateTransform'
import { CanvasLayer } from './CanvasLayer'
import { GridLayer } from './GridLayer'
import { InteractionLayer } from './InteractionLayer'
import { StatusBar } from './StatusBar'
import { TextEditorOverlay } from './TextEditorOverlay'
import { ZoomControls } from './ZoomControls'

const CURSOR_BY_TOOL: Record<string, string> = {
  select: 'default',
  move: 'grab',
  pencil: 'crosshair',
  brush: 'crosshair',
  eraser: 'crosshair',
  rectangle: 'crosshair',
  circle: 'crosshair',
  line: 'crosshair',
  arrow: 'crosshair',
  text: 'text',
  delete: 'not-allowed',
}

export function CanvasStage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const interactionCanvasRef = useRef<HTMLCanvasElement>(null)
  const draftRef = useRef<WhiteboardElement | null>(null)
  const dragRef = useRef<DragState | null>(null)
  const lastWorldPointRef = useRef<Point>({ x: 0, y: 0 })
  const redrawScheduledRef = useRef(false)

  const [editingText, setEditingText] = useState<TextElement | null>(null)
  const activeTool = useWhiteboardStore((state) => state.activeTool)

  const drawInteractionLayer = useCallback(() => {
    const canvas = interactionCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { zoom, scrollX, scrollY } = useWhiteboardStore.getState()
    const dpr = window.devicePixelRatio || 1

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, -scrollX * dpr * zoom, -scrollY * dpr * zoom)

    const draft = draftRef.current
    if (draft) renderElement(ctx, draft)

    const drag = dragRef.current
    if (drag?.kind === 'marquee') {
      const current = lastWorldPointRef.current
      const x = Math.min(drag.startWorld.x, current.x)
      const y = Math.min(drag.startWorld.y, current.y)
      const width = Math.abs(current.x - drag.startWorld.x)
      const height = Math.abs(current.y - drag.startWorld.y)
      ctx.save()
      ctx.fillStyle = 'rgba(79, 70, 229, 0.08)'
      ctx.strokeStyle = '#4f46e5'
      ctx.lineWidth = 1 / zoom
      ctx.setLineDash([4 / zoom, 3 / zoom])
      ctx.fillRect(x, y, width, height)
      ctx.strokeRect(x, y, width, height)
      ctx.restore()
    }
  }, [])

  const requestRedraw = useCallback(() => {
    if (redrawScheduledRef.current) return
    redrawScheduledRef.current = true
    requestAnimationFrame(() => {
      redrawScheduledRef.current = false
      drawInteractionLayer()
    })
  }, [drawInteractionLayer])

  const beginTextEdit = useCallback((element: TextElement) => {
    const exists = useWhiteboardStore.getState().elements.some((el) => el.id === element.id)
    if (exists) useWhiteboardStore.getState().setEditingTextElementId(element.id)
    setEditingText(element)
  }, [])

  const handleTextCommit = useCallback((element: TextElement, text: string) => {
    const state = useWhiteboardStore.getState()
    const existing = state.elements.some((el) => el.id === element.id)
    const isEmpty = text.trim().length === 0

    if (existing && isEmpty) {
      state.commit()
      state.removeElements([element.id])
    } else if (!isEmpty) {
      const { width, height } = measureTextBlock(
        text,
        element.fontFamily,
        element.fontSize,
        element.fontWeight,
        element.fontStyle,
      )
      const finalElement: TextElement = { ...element, text, width, height, updatedAt: Date.now() }
      state.commit()
      if (existing) state.updateElement(element.id, finalElement)
      else state.addElement(finalElement)
      state.setSelectedIds([element.id])
    }

    state.setEditingTextElementId(null)
    setEditingText(null)
  }, [])

  function buildCtx(worldPoint: Point, screenPoint: Point, shiftKey: boolean): ToolContext {
    return {
      worldPoint,
      screenPoint,
      shiftKey,
      store: useWhiteboardStore,
      draftRef,
      dragRef,
      requestRedraw,
      beginTextEdit,
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    const container = containerRef.current
    if (!container) return
    // Prevents the browser's default mousedown focus-shift (which targets the non-focusable
    // container and would otherwise steal focus back from a textarea a tool mounts in response,
    // e.g. the text tool's editor).
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const screenPoint = getPointerScreenPoint(event, container)
    const viewport = useWhiteboardStore.getState()
    const worldPoint = screenToWorld(screenPoint, viewport)
    lastWorldPointRef.current = worldPoint
    toolRegistry[viewport.activeTool].onPointerDown(
      buildCtx(worldPoint, screenPoint, event.shiftKey),
    )
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const container = containerRef.current
    if (!container) return
    const screenPoint = getPointerScreenPoint(event, container)
    const viewport = useWhiteboardStore.getState()
    const worldPoint = screenToWorld(screenPoint, viewport)
    lastWorldPointRef.current = worldPoint
    toolRegistry[viewport.activeTool].onPointerMove(
      buildCtx(worldPoint, screenPoint, event.shiftKey),
    )
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const container = containerRef.current
    if (!container) return
    const screenPoint = getPointerScreenPoint(event, container)
    const state = useWhiteboardStore.getState()
    const worldPoint = screenToWorld(screenPoint, state)
    const tool = state.activeTool
    toolRegistry[tool].onPointerUp(buildCtx(worldPoint, screenPoint, event.shiftKey))

    if (DRAW_TOOLS.includes(tool) && !state.isToolLocked) {
      state.setActiveTool('select')
    }
  }

  // Native, non-passive wheel listener — React's synthetic onWheel is passive and can't preventDefault.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleWheel(event: WheelEvent) {
      event.preventDefault()
      if (!container) return
      const screenPoint = getPointerScreenPoint(event, container)
      const state = useWhiteboardStore.getState()
      if (event.ctrlKey || event.metaKey) {
        const factor = Math.pow(1.0015, -event.deltaY)
        state.setZoomAtPoint(state.zoom * factor, screenPoint)
      } else {
        state.panBy(-event.deltaX, -event.deltaY)
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <div
      ref={containerRef}
      data-canvas-stage
      className="relative h-full w-full touch-none overflow-hidden bg-surface-muted"
      style={{ cursor: CURSOR_BY_TOOL[activeTool] ?? 'default' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <GridLayer />
      <CanvasLayer />
      <InteractionLayer canvasRef={interactionCanvasRef} onResize={drawInteractionLayer} />
      {!editingText && (
        <SelectionOverlay getContainerRect={() => containerRef.current!.getBoundingClientRect()} />
      )}
      {editingText && (
        <TextEditorOverlay
          key={editingText.id}
          element={editingText}
          onCommit={(text) => handleTextCommit(editingText, text)}
        />
      )}

      <div className="pointer-events-none absolute bottom-3 right-3">
        <ZoomControls />
      </div>
      <StatusBar />
    </div>
  )
}
