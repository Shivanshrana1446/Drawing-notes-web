import { createFreehandElement } from '@/features/elements/factories/createElement'

import type { ToolHandler } from '../types'

/** Pencil and brush intentionally ignore snap-to-grid — grid-snapped freehand strokes would look broken. */
export function createFreehandTool(type: 'pencil' | 'brush'): ToolHandler {
  return {
    onPointerDown: (ctx) => {
      const style = ctx.store.getState().currentStyle
      ctx.draftRef.current = createFreehandElement(type, ctx.worldPoint, style)
      ctx.requestRedraw()
    },

    onPointerMove: (ctx) => {
      const draft = ctx.draftRef.current
      if (!draft || draft.type !== type) return
      draft.points.push(ctx.worldPoint)
      const xs = draft.points.map((point) => point.x)
      const ys = draft.points.map((point) => point.y)
      draft.x = Math.min(...xs)
      draft.y = Math.min(...ys)
      draft.width = Math.max(...xs) - draft.x
      draft.height = Math.max(...ys) - draft.y
      ctx.requestRedraw()
    },

    onPointerUp: (ctx) => {
      const draft = ctx.draftRef.current
      if (!draft || draft.type !== type) return
      ctx.draftRef.current = null
      const state = ctx.store.getState()
      state.commit()
      state.addElement(draft)
      state.setSelectedIds([draft.id])
      ctx.requestRedraw()
    },
  }
}
