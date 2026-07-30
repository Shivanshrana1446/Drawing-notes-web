import type { Bounds, Point, Size } from '@/shared/types/common'

import type { ImageElement, LineElement, ShapeElement, TextElement, WhiteboardElement } from './types'

const HIT_PADDING = 6

function hasPoints(
  element: WhiteboardElement,
): element is Extract<WhiteboardElement, { points: Point[] }> {
  return (
    element.type === 'line' ||
    element.type === 'arrow' ||
    element.type === 'pencil' ||
    element.type === 'brush'
  )
}

export function getElementBounds(element: WhiteboardElement): Bounds {
  if (hasPoints(element)) {
    const xs = element.points.map((point) => point.x)
    const ys = element.points.map((point) => point.y)
    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    }
  }
  return {
    minX: element.x,
    minY: element.y,
    maxX: element.x + element.width,
    maxY: element.y + element.height,
  }
}

export function unionBounds(bounds: Bounds[]): Bounds | null {
  if (bounds.length === 0) return null
  return bounds.reduce((acc, current) => ({
    minX: Math.min(acc.minX, current.minX),
    minY: Math.min(acc.minY, current.minY),
    maxX: Math.max(acc.maxX, current.maxX),
    maxY: Math.max(acc.maxY, current.maxY),
  }))
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY
}

export function pointInBounds(point: Point, bounds: Bounds, padding = 0): boolean {
  return (
    point.x >= bounds.minX - padding &&
    point.x <= bounds.maxX + padding &&
    point.y >= bounds.minY - padding &&
    point.y <= bounds.maxY + padding
  )
}

function distanceToSegment(point: Point, a: Point, b: Point): number {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const lengthSquared = dx * dx + dy * dy
  if (lengthSquared === 0) return Math.hypot(point.x - a.x, point.y - a.y)
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared))
  const closestX = a.x + t * dx
  const closestY = a.y + t * dy
  return Math.hypot(point.x - closestX, point.y - closestY)
}

export function hitTestElement(element: WhiteboardElement, point: Point): boolean {
  const bounds = getElementBounds(element)

  if (element.type === 'text' || element.type === 'image') {
    return pointInBounds(point, bounds, HIT_PADDING)
  }

  if (element.type === 'rectangle') {
    return pointInBounds(point, bounds, HIT_PADDING)
  }

  if (element.type === 'circle') {
    const cx = element.x + element.width / 2
    const cy = element.y + element.height / 2
    const rx = Math.abs(element.width) / 2 + HIT_PADDING
    const ry = Math.abs(element.height) / 2 + HIT_PADDING
    if (rx === 0 || ry === 0) return false
    return (point.x - cx) ** 2 / rx ** 2 + (point.y - cy) ** 2 / ry ** 2 <= 1
  }

  // line, arrow, pencil, brush — distance from point to the nearest segment
  if (
    element.type === 'line' ||
    element.type === 'arrow' ||
    element.type === 'pencil' ||
    element.type === 'brush'
  ) {
    const padding = HIT_PADDING + element.strokeWidth
    if (!pointInBounds(point, bounds, padding)) return false
    if (element.points.length === 1) {
      return distanceToSegment(point, element.points[0], element.points[0]) <= padding
    }
    for (let i = 0; i < element.points.length - 1; i++) {
      const a = element.points[i]
      const b = element.points[i + 1]
      if (distanceToSegment(point, a, b) <= padding) return true
    }
    return false
  }

  return false
}

export function translateElement<T extends WhiteboardElement>(
  element: T,
  dx: number,
  dy: number,
): T {
  if (hasPoints(element)) {
    return {
      ...element,
      x: element.x + dx,
      y: element.y + dy,
      points: element.points.map((point) => ({ x: point.x + dx, y: point.y + dy })),
      updatedAt: Date.now(),
    }
  }
  return { ...element, x: element.x + dx, y: element.y + dy, updatedAt: Date.now() }
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

export const RESIZE_HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']

/** Resizes a box-based element (rectangle, circle, text, image) by dragging one handle to `point`. */
export function resizeBoxElement<T extends ShapeElement | TextElement | ImageElement>(
  element: T,
  handle: ResizeHandle,
  point: Point,
): T {
  let newLeft = element.x
  let newTop = element.y
  let newRight = element.x + element.width
  let newBottom = element.y + element.height

  if (handle.includes('w')) newLeft = point.x
  if (handle.includes('e')) newRight = point.x
  if (handle.includes('n')) newTop = point.y
  if (handle.includes('s')) newBottom = point.y

  return {
    ...element,
    x: Math.min(newLeft, newRight),
    y: Math.min(newTop, newBottom),
    width: Math.abs(newRight - newLeft),
    height: Math.abs(newBottom - newTop),
    updatedAt: Date.now(),
  }
}

/** Resizes a line/arrow by dragging one of its two endpoints to `point`. */
export function resizeLineEndpoint(
  element: LineElement,
  endpointIndex: 0 | 1,
  point: Point,
): LineElement {
  const points: [Point, Point] =
    endpointIndex === 0 ? [point, element.points[1]] : [element.points[0], point]
  return {
    ...element,
    points,
    x: Math.min(points[0].x, points[1].x),
    y: Math.min(points[0].y, points[1].y),
    width: Math.abs(points[1].x - points[0].x),
    height: Math.abs(points[1].y - points[0].y),
    updatedAt: Date.now(),
  }
}

/** Normalizes a possibly-negative width/height (drawn right-to-left/bottom-to-top) into a positive box. */
export function normalizeBox<T extends { x: number; y: number; width: number; height: number }>(
  box: T,
): T {
  return {
    ...box,
    x: Math.min(box.x, box.x + box.width),
    y: Math.min(box.y, box.y + box.height),
    width: Math.abs(box.width),
    height: Math.abs(box.height),
  }
}

let measureCanvas: HTMLCanvasElement | null = null

export function measureTextBlock(
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: TextElement['fontWeight'],
  fontStyle: TextElement['fontStyle'],
): Size {
  const lines = text.length > 0 ? text.split('\n') : ['']
  const lineHeight = fontSize * 1.25

  if (!measureCanvas) measureCanvas = document.createElement('canvas')
  const ctx = measureCanvas.getContext('2d')
  if (!ctx) return { width: 1, height: lineHeight * lines.length }

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`
  const width = Math.max(1, ...lines.map((line) => ctx.measureText(line || ' ').width))
  return { width, height: lineHeight * lines.length }
}
