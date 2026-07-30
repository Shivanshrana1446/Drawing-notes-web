import type { DashStyle } from '@/shared/types/common'

import { getCachedImage } from './imageCache'
import type {
  FreehandElement,
  ImageElement,
  LineElement,
  ShapeElement,
  TextElement,
  WhiteboardElement,
} from './types'

function applyDash(ctx: CanvasRenderingContext2D, dash: DashStyle, strokeWidth: number) {
  if (dash === 'dashed') ctx.setLineDash([strokeWidth * 3, strokeWidth * 2])
  else if (dash === 'dotted') ctx.setLineDash([strokeWidth, strokeWidth * 2])
  else ctx.setLineDash([])
}

function renderShape(ctx: CanvasRenderingContext2D, element: ShapeElement) {
  ctx.save()
  ctx.globalAlpha = element.opacity
  ctx.strokeStyle = element.strokeColor
  ctx.fillStyle = element.fillColor
  ctx.lineWidth = element.strokeWidth
  ctx.lineJoin = 'round'
  applyDash(ctx, element.dash, element.strokeWidth)

  ctx.beginPath()
  if (element.type === 'rectangle') {
    ctx.rect(element.x, element.y, element.width, element.height)
  } else {
    const cx = element.x + element.width / 2
    const cy = element.y + element.height / 2
    ctx.ellipse(
      cx,
      cy,
      Math.abs(element.width) / 2,
      Math.abs(element.height) / 2,
      0,
      0,
      Math.PI * 2,
    )
  }
  if (element.fillColor !== 'transparent') ctx.fill()
  if (element.strokeWidth > 0) ctx.stroke()
  ctx.restore()
}

function renderLine(ctx: CanvasRenderingContext2D, element: LineElement) {
  ctx.save()
  ctx.globalAlpha = element.opacity
  ctx.strokeStyle = element.strokeColor
  ctx.lineWidth = element.strokeWidth
  ctx.lineCap = 'round'
  applyDash(ctx, element.dash, element.strokeWidth)

  const [start, end] = element.points
  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  ctx.lineTo(end.x, end.y)
  ctx.stroke()

  if (element.type === 'arrow') {
    const angle = Math.atan2(end.y - start.y, end.x - start.x)
    const headLength = Math.max(12, element.strokeWidth * 4)
    const headAngle = Math.PI / 7

    ctx.setLineDash([])
    ctx.beginPath()
    ctx.moveTo(end.x, end.y)
    ctx.lineTo(
      end.x - headLength * Math.cos(angle - headAngle),
      end.y - headLength * Math.sin(angle - headAngle),
    )
    ctx.lineTo(
      end.x - headLength * Math.cos(angle + headAngle),
      end.y - headLength * Math.sin(angle + headAngle),
    )
    ctx.closePath()
    ctx.fillStyle = element.strokeColor
    ctx.fill()
  }
  ctx.restore()
}

function renderFreehand(ctx: CanvasRenderingContext2D, element: FreehandElement) {
  const { points } = element
  if (points.length === 0) return

  ctx.save()
  ctx.globalAlpha = element.type === 'brush' ? element.opacity * 0.85 : element.opacity
  ctx.strokeStyle = element.strokeColor
  ctx.fillStyle = element.strokeColor
  ctx.lineWidth = element.type === 'brush' ? element.strokeWidth * 2.4 : element.strokeWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.setLineDash([])

  if (points.length === 1) {
    ctx.beginPath()
    ctx.arc(points[0].x, points[0].y, ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    return
  }

  ctx.beginPath()
  ctx.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2
    const midY = (points[i].y + points[i + 1].y) / 2
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY)
  }
  const last = points[points.length - 1]
  ctx.lineTo(last.x, last.y)
  ctx.stroke()
  ctx.restore()
}

function renderText(ctx: CanvasRenderingContext2D, element: TextElement) {
  ctx.save()
  ctx.globalAlpha = element.opacity
  ctx.fillStyle = element.textColor
  const weight = element.fontWeight === 'bold' ? 'bold' : 'normal'
  const style = element.fontStyle === 'italic' ? 'italic' : 'normal'
  ctx.font = `${style} ${weight} ${element.fontSize}px ${element.fontFamily}`
  ctx.textBaseline = 'top'
  ctx.textAlign = element.textAlign

  const lineHeight = element.fontSize * 1.25
  const lines = element.text.split('\n')
  const anchorX =
    element.textAlign === 'center'
      ? element.x + element.width / 2
      : element.textAlign === 'right'
        ? element.x + element.width
        : element.x

  lines.forEach((line, index) => {
    const lineY = element.y + index * lineHeight
    ctx.fillText(line, anchorX, lineY)

    if (element.textDecoration === 'underline') {
      const metrics = ctx.measureText(line || ' ')
      const underlineY = lineY + element.fontSize * 1.05
      let lineStartX = anchorX
      if (element.textAlign === 'center') lineStartX = anchorX - metrics.width / 2
      else if (element.textAlign === 'right') lineStartX = anchorX - metrics.width

      ctx.strokeStyle = element.textColor
      ctx.lineWidth = Math.max(1, element.fontSize / 16)
      ctx.beginPath()
      ctx.moveTo(lineStartX, underlineY)
      ctx.lineTo(lineStartX + metrics.width, underlineY)
      ctx.stroke()
    }
  })
  ctx.restore()
}

function renderImage(ctx: CanvasRenderingContext2D, element: ImageElement) {
  const img = getCachedImage(element.src)
  if (!img) return

  ctx.save()
  ctx.globalAlpha = element.opacity
  ctx.drawImage(img, element.x, element.y, element.width, element.height)
  ctx.restore()
}

export function renderElement(ctx: CanvasRenderingContext2D, element: WhiteboardElement) {
  switch (element.type) {
    case 'rectangle':
    case 'circle':
      renderShape(ctx, element)
      return
    case 'line':
    case 'arrow':
      renderLine(ctx, element)
      return
    case 'pencil':
    case 'brush':
      renderFreehand(ctx, element)
      return
    case 'text':
      renderText(ctx, element)
      return
    case 'image':
      renderImage(ctx, element)
      return
  }
}
