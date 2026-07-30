import { createTextElement } from '@/features/elements/factories/createElement'
import { hitTestElement } from '@/features/elements/geometry'
import type { TextElement } from '@/features/elements/types'

import type { ToolHandler } from '../types'

export const textTool: ToolHandler = {
  onPointerDown: (ctx) => {
    const state = ctx.store.getState()
    let hit: TextElement | undefined
    for (let i = state.elements.length - 1; i >= 0; i--) {
      const element = state.elements[i]
      if (element.type === 'text' && hitTestElement(element, ctx.worldPoint)) {
        hit = element
        break
      }
    }
    const target = hit ?? createTextElement(ctx.worldPoint, state.currentStyle)
    ctx.beginTextEdit(target)
  },
  onPointerMove: () => undefined,
  onPointerUp: () => undefined,
}
