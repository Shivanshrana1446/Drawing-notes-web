import type { MutableRefObject } from 'react'
import type { StoreApi } from 'zustand'

import type { ResizeHandle } from '@/features/elements/geometry'
import type { TextElement, WhiteboardElement } from '@/features/elements/types'
import type { Point } from '@/shared/types/common'
import type { AppState } from '@/store/types'

export type ToolType =
  | 'select'
  | 'move'
  | 'pencil'
  | 'brush'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'text'
  | 'delete'

export type DragKind = 'move' | 'resize-box' | 'resize-line' | 'pan' | 'marquee' | 'erase'

export interface DragState {
  kind: DragKind
  startWorld: Point
  startScreen: Point
  originElements: WhiteboardElement[]
  handle?: ResizeHandle
  endpointIndex?: 0 | 1
  /** Whether history.commit() has already run for this gesture — commit lazily, on the first real mutation. */
  committed: boolean
}

export interface ToolContext {
  worldPoint: Point
  screenPoint: Point
  shiftKey: boolean
  store: StoreApi<AppState>
  draftRef: MutableRefObject<WhiteboardElement | null>
  dragRef: MutableRefObject<DragState | null>
  requestRedraw: () => void
  beginTextEdit: (element: TextElement) => void
}

export interface ToolHandler {
  onPointerDown: (ctx: ToolContext) => void
  onPointerMove: (ctx: ToolContext) => void
  onPointerUp: (ctx: ToolContext) => void
}
