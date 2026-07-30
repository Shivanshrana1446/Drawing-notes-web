import type { Point } from '@/shared/types/common'
import { roundToStep } from '@/shared/utils'

export function snapPointToGrid(point: Point, gridSize: number): Point {
  return { x: roundToStep(point.x, gridSize), y: roundToStep(point.y, gridSize) }
}
