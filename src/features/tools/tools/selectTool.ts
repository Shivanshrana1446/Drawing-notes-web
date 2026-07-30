import {
  boundsIntersect,
  getElementBounds,
  hitTestElement,
  translateElement,
} from '@/features/elements/geometry'
import type { WhiteboardElement } from '@/features/elements/types'

import type { ToolHandler } from '../types'

export const selectTool: ToolHandler = {
  onPointerDown: (ctx) => {
    const state = ctx.store.getState()
    const { elements, selectedIds } = state

    let hit: WhiteboardElement | undefined
    for (let i = elements.length - 1; i >= 0; i--) {
      if (hitTestElement(elements[i], ctx.worldPoint)) {
        hit = elements[i]
        break
      }
    }

    if (hit) {
      const hitElement = hit
      const alreadySelected = selectedIds.includes(hitElement.id)
      const nextSelection = ctx.shiftKey
        ? alreadySelected
          ? selectedIds.filter((id) => id !== hitElement.id)
          : [...selectedIds, hitElement.id]
        : alreadySelected
          ? selectedIds
          : [hitElement.id]

      state.setSelectedIds(nextSelection)

      if (nextSelection.includes(hitElement.id)) {
        ctx.dragRef.current = {
          kind: 'move',
          startWorld: ctx.worldPoint,
          startScreen: ctx.screenPoint,
          originElements: elements.filter((element) => nextSelection.includes(element.id)),
          committed: false,
        }
      }
    } else {
      if (!ctx.shiftKey) state.setSelectedIds([])
      ctx.dragRef.current = {
        kind: 'marquee',
        startWorld: ctx.worldPoint,
        startScreen: ctx.screenPoint,
        originElements: [],
        committed: false,
      }
    }
    ctx.requestRedraw()
  },

  onPointerMove: (ctx) => {
    const drag = ctx.dragRef.current
    if (!drag) return
    const state = ctx.store.getState()

    if (drag.kind === 'move') {
      const dx = ctx.worldPoint.x - drag.startWorld.x
      const dy = ctx.worldPoint.y - drag.startWorld.y
      if (dx === 0 && dy === 0) return

      if (!drag.committed) {
        state.commit()
        drag.committed = true
      }
      for (const original of drag.originElements) {
        const moved = translateElement(original, dx, dy)
        state.updateElement(original.id, moved)
      }
    }
    ctx.requestRedraw()
  },

  onPointerUp: (ctx) => {
    const drag = ctx.dragRef.current
    if (!drag) return
    const state = ctx.store.getState()

    if (drag.kind === 'marquee') {
      const marqueeBounds = {
        minX: Math.min(drag.startWorld.x, ctx.worldPoint.x),
        minY: Math.min(drag.startWorld.y, ctx.worldPoint.y),
        maxX: Math.max(drag.startWorld.x, ctx.worldPoint.x),
        maxY: Math.max(drag.startWorld.y, ctx.worldPoint.y),
      }
      const hasArea =
        marqueeBounds.maxX - marqueeBounds.minX > 2 || marqueeBounds.maxY - marqueeBounds.minY > 2
      if (hasArea) {
        const hits = state.elements.filter((element) =>
          boundsIntersect(getElementBounds(element), marqueeBounds),
        )
        state.setSelectedIds(hits.map((element) => element.id))
      }
    }

    ctx.dragRef.current = null
    ctx.requestRedraw()
  },
}
