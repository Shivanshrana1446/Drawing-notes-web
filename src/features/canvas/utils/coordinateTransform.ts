import type { Point } from '@/shared/types/common'

export interface ViewportTransform {
  zoom: number
  scrollX: number
  scrollY: number
}

export function screenToWorld(screenPoint: Point, viewport: ViewportTransform): Point {
  return {
    x: screenPoint.x / viewport.zoom + viewport.scrollX,
    y: screenPoint.y / viewport.zoom + viewport.scrollY,
  }
}

export function worldToScreen(worldPoint: Point, viewport: ViewportTransform): Point {
  return {
    x: (worldPoint.x - viewport.scrollX) * viewport.zoom,
    y: (worldPoint.y - viewport.scrollY) * viewport.zoom,
  }
}

export function getPointerScreenPoint(
  event: { clientX: number; clientY: number },
  container: HTMLElement,
): Point {
  const rect = container.getBoundingClientRect()
  return { x: event.clientX - rect.left, y: event.clientY - rect.top }
}
