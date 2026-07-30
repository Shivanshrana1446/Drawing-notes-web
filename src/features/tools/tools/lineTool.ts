import { createLineElement } from '@/features/elements/factories/createElement'
import { distance } from '@/shared/utils'

import type { ToolHandler } from '../types'
import { resolvePoint } from '../utils'

export function createLineTool(type: 'line' | 'arrow'): ToolHandler {
  return {
    onPointerDown: (ctx) => {
      const style = ctx.store.getState().currentStyle
      ctx.draftRef.current = createLineElement(type, resolvePoint(ctx), style)
      ctx.requestRedraw()
    },

    onPointerMove: (ctx) => {
      const draft = ctx.draftRef.current
      if (!draft || draft.type !== type) return
      const point = resolvePoint(ctx)
      draft.points[1] = point
      draft.x = Math.min(draft.points[0].x, point.x)
      draft.y = Math.min(draft.points[0].y, point.y)
      draft.width = Math.abs(point.x - draft.points[0].x)
      draft.height = Math.abs(point.y - draft.points[0].y)
      ctx.requestRedraw()
    },

    onPointerUp: (ctx) => {
      const draft = ctx.draftRef.current
      if (!draft || draft.type !== type) return
      ctx.draftRef.current = null
      const [start, end] = draft.points
      if (distance(start.x, start.y, end.x, end.y) < 2) {
        ctx.requestRedraw()
        return
      }
      const state = ctx.store.getState()
      state.commit()
      state.addElement(draft)
      state.setSelectedIds([draft.id])
      ctx.requestRedraw()
    },
  }
}
