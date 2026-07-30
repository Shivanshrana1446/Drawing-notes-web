import type { ToolHandler } from '../types'

/** Hand tool: drags the viewport (pan) instead of drawing or selecting. */
export const moveTool: ToolHandler = {
  onPointerDown: (ctx) => {
    ctx.dragRef.current = {
      kind: 'pan',
      startWorld: ctx.worldPoint,
      startScreen: ctx.screenPoint,
      originElements: [],
      committed: false,
    }
  },

  onPointerMove: (ctx) => {
    const drag = ctx.dragRef.current
    if (!drag || drag.kind !== 'pan') return
    const dx = ctx.screenPoint.x - drag.startScreen.x
    const dy = ctx.screenPoint.y - drag.startScreen.y
    ctx.store.getState().panBy(dx, dy)
    drag.startScreen = ctx.screenPoint
    ctx.requestRedraw()
  },

  onPointerUp: (ctx) => {
    ctx.dragRef.current = null
  },
}
