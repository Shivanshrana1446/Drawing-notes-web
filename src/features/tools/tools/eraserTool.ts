import { hitTestElement } from '@/features/elements/geometry'

import type { ToolContext, ToolHandler } from '../types'

function eraseAtPoint(ctx: ToolContext) {
  const state = ctx.store.getState()
  const hits = state.elements.filter((element) => hitTestElement(element, ctx.worldPoint))
  if (hits.length === 0) return

  const drag = ctx.dragRef.current
  if (drag && !drag.committed) {
    state.commit()
    drag.committed = true
  }
  state.removeElements(hits.map((element) => element.id))
  state.setSelectedIds([])
  ctx.requestRedraw()
}

export const eraserTool: ToolHandler = {
  onPointerDown: (ctx) => {
    ctx.dragRef.current = {
      kind: 'erase',
      startWorld: ctx.worldPoint,
      startScreen: ctx.screenPoint,
      originElements: [],
      committed: false,
    }
    eraseAtPoint(ctx)
  },

  onPointerMove: (ctx) => {
    if (!ctx.dragRef.current || ctx.dragRef.current.kind !== 'erase') return
    eraseAtPoint(ctx)
  },

  onPointerUp: (ctx) => {
    ctx.dragRef.current = null
  },
}
