import { hitTestElement } from '@/features/elements/geometry'

import type { ToolHandler } from '../types'

/** Click-to-delete: clicking any element removes it immediately. */
export const deleteTool: ToolHandler = {
  onPointerDown: (ctx) => {
    const state = ctx.store.getState()
    for (let i = state.elements.length - 1; i >= 0; i--) {
      const element = state.elements[i]
      if (hitTestElement(element, ctx.worldPoint)) {
        state.commit()
        state.removeElements([element.id])
        ctx.requestRedraw()
        return
      }
    }
  },
  onPointerMove: () => undefined,
  onPointerUp: () => undefined,
}
