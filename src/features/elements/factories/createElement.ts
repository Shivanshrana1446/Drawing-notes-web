import { generateId } from '@/shared/utils'
import type { Point, Size } from '@/shared/types/common'

import type {
  DrawStyle,
  FreehandElement,
  ImageElement,
  LineElement,
  ShapeElement,
  TextElement,
} from '../types'

export function createShapeElement(
  type: 'rectangle' | 'circle',
  origin: Point,
  style: DrawStyle,
): ShapeElement {
  const now = Date.now()
  return {
    id: generateId(),
    type,
    x: origin.x,
    y: origin.y,
    width: 0,
    height: 0,
    strokeColor: style.strokeColor,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    dash: style.dash,
    fillColor: style.fillColor,
    createdAt: now,
    updatedAt: now,
  }
}

export function createLineElement(
  type: 'line' | 'arrow',
  origin: Point,
  style: DrawStyle,
): LineElement {
  const now = Date.now()
  return {
    id: generateId(),
    type,
    x: origin.x,
    y: origin.y,
    width: 0,
    height: 0,
    strokeColor: style.strokeColor,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    dash: style.dash,
    points: [origin, origin],
    createdAt: now,
    updatedAt: now,
  }
}

export function createFreehandElement(
  type: 'pencil' | 'brush',
  origin: Point,
  style: DrawStyle,
): FreehandElement {
  const now = Date.now()
  return {
    id: generateId(),
    type,
    x: origin.x,
    y: origin.y,
    width: 0,
    height: 0,
    strokeColor: style.strokeColor,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    dash: 'solid',
    points: [origin],
    createdAt: now,
    updatedAt: now,
  }
}

export function createImageElement(origin: Point, size: Size, src: string): ImageElement {
  const now = Date.now()
  return {
    id: generateId(),
    type: 'image',
    x: origin.x,
    y: origin.y,
    width: size.width,
    height: size.height,
    strokeColor: 'transparent',
    strokeWidth: 0,
    opacity: 1,
    dash: 'solid',
    src,
    naturalWidth: size.width,
    naturalHeight: size.height,
    createdAt: now,
    updatedAt: now,
  }
}

export function createTextElement(origin: Point, style: DrawStyle, text = ''): TextElement {
  const now = Date.now()
  return {
    id: generateId(),
    type: 'text',
    x: origin.x,
    y: origin.y,
    width: 0,
    height: style.fontSize * 1.25,
    strokeColor: style.strokeColor,
    strokeWidth: style.strokeWidth,
    opacity: style.opacity,
    dash: 'solid',
    text,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    textDecoration: style.textDecoration,
    textColor: style.textColor,
    textAlign: style.textAlign,
    createdAt: now,
    updatedAt: now,
  }
}
