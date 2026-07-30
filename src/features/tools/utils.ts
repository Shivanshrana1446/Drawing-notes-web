import { snapPointToGrid } from '@/features/canvas/utils/snapToGrid'
import type { Point } from '@/shared/types/common'

import type { ToolContext } from './types'

/** Returns the tool's working point, snapped to the grid when snap-to-grid is enabled. */
export function resolvePoint(ctx: ToolContext): Point {
  const state = ctx.store.getState()
  return state.snapToGridEnabled ? snapPointToGrid(ctx.worldPoint, state.gridSize) : ctx.worldPoint
}
