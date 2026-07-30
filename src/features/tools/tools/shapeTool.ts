import { createShapeElement } from '@/features/elements/factories/createElement'
import { normalizeBox } from '@/features/elements/geometry'

import type { ToolHandler } from '../types'
import { resolvePoint } from '../utils'

export function createShapeTool(type: 'rectangle' | 'circle'): ToolHandler {
  return {
    onPointerDown: (ctx) => {
      const style = ctx.store.getState().currentStyle
      ctx.draftRef.current = createShapeElement(type, resolvePoint(ctx), style)
      ctx.requestRedraw()
    },

    onPointerMove: (ctx) => {
      const draft = ctx.draftRef.current
      if (!draft || draft.type !== type) return
      const point = resolvePoint(ctx)
      draft.width = point.x - draft.x
      draft.height = point.y - draft.y
      ctx.requestRedraw()
    },

    onPointerUp: (ctx) => {
      const draft = ctx.draftRef.current
      if (!draft || draft.type !== type) return
      ctx.draftRef.current = null
      if (Math.abs(draft.width) < 2 && Math.abs(draft.height) < 2) {
        ctx.requestRedraw()
        return
      }
      const state = ctx.store.getState()
      state.commit()
      state.addElement(normalizeBox(draft))
      state.setSelectedIds([draft.id])
      ctx.requestRedraw()
    },
  }
}
