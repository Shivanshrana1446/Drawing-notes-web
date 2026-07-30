import { getElementBounds, unionBounds } from '@/features/elements/geometry'
import type { WhiteboardElement } from '@/features/elements/types'
import { useWhiteboardStore } from '@/store'

import { downloadBlob } from './downloadBlob'

const EXPORT_PADDING = 40
const FALLBACK_BOUNDS = { minX: 0, minY: 0, maxX: 800, maxY: 600 }

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function dashArray(dash: WhiteboardElement['dash'], strokeWidth: number): string {
  if (dash === 'dashed') return `${strokeWidth * 3},${strokeWidth * 2}`
  if (dash === 'dotted') return `${strokeWidth},${strokeWidth * 2}`
  return ''
}

function elementToSvg(element: WhiteboardElement): string {
  const dash = dashArray(element.dash, element.strokeWidth)
  const dashAttr = dash ? ` stroke-dasharray="${dash}"` : ''
  const opacityAttr = ` opacity="${element.opacity}"`

  switch (element.type) {
    case 'rectangle':
      return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" fill="${element.fillColor}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}"${dashAttr}${opacityAttr} />`

    case 'circle': {
      const cx = element.x + element.width / 2
      const cy = element.y + element.height / 2
      return `<ellipse cx="${cx}" cy="${cy}" rx="${Math.abs(element.width) / 2}" ry="${Math.abs(element.height) / 2}" fill="${element.fillColor}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}"${dashAttr}${opacityAttr} />`
    }

    case 'line':
    case 'arrow': {
      const [start, end] = element.points
      const line = `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="${element.strokeColor}" stroke-width="${element.strokeWidth}" stroke-linecap="round"${dashAttr}${opacityAttr} />`
      if (element.type !== 'arrow') return line

      const angle = Math.atan2(end.y - start.y, end.x - start.x)
      const headLength = Math.max(12, element.strokeWidth * 4)
      const headAngle = Math.PI / 7
      const p1 = {
        x: end.x - headLength * Math.cos(angle - headAngle),
        y: end.y - headLength * Math.sin(angle - headAngle),
      }
      const p2 = {
        x: end.x - headLength * Math.cos(angle + headAngle),
        y: end.y - headLength * Math.sin(angle + headAngle),
      }
      const head = `<polygon points="${end.x},${end.y} ${p1.x},${p1.y} ${p2.x},${p2.y}" fill="${element.strokeColor}"${opacityAttr} />`
      return `${line}\n  ${head}`
    }

    case 'pencil':
    case 'brush': {
      if (element.points.length === 0) return ''
      const strokeWidth = element.type === 'brush' ? element.strokeWidth * 2.4 : element.strokeWidth
      const [first, ...rest] = element.points
      const path = rest.reduce(
        (acc, point) => `${acc} L ${point.x} ${point.y}`,
        `M ${first.x} ${first.y}`,
      )
      return `<path d="${path}" fill="none" stroke="${element.strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"${opacityAttr} />`
    }

    case 'text': {
      const weight = element.fontWeight === 'bold' ? 'bold' : 'normal'
      const style = element.fontStyle === 'italic' ? 'italic' : 'normal'
      const decoration = element.textDecoration === 'underline' ? 'underline' : 'none'
      const anchor =
        element.textAlign === 'center' ? 'middle' : element.textAlign === 'right' ? 'end' : 'start'
      const anchorX =
        element.textAlign === 'center'
          ? element.x + element.width / 2
          : element.textAlign === 'right'
            ? element.x + element.width
            : element.x
      const lineHeight = element.fontSize * 1.25
      const lines = element.text
        .split('\n')
        .map(
          (line, index) =>
            `<tspan x="${anchorX}" y="${element.y + index * lineHeight + element.fontSize}">${escapeXml(line)}</tspan>`,
        )
        .join('')
      return `<text font-family="${escapeXml(element.fontFamily)}" font-size="${element.fontSize}" font-weight="${weight}" font-style="${style}" text-decoration="${decoration}" text-anchor="${anchor}" fill="${element.textColor}"${opacityAttr}>${lines}</text>`
    }

    case 'image':
      return `<image x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" href="${escapeXml(element.src)}"${opacityAttr} />`

    default:
      return ''
  }
}

export function exportToSVG(): void {
  const elements = useWhiteboardStore.getState().elements
  const bounds =
    unionBounds(elements.map((element) => getElementBounds(element))) ?? FALLBACK_BOUNDS
  const width = bounds.maxX - bounds.minX + EXPORT_PADDING * 2
  const height = bounds.maxY - bounds.minY + EXPORT_PADDING * 2
  const offsetX = -bounds.minX + EXPORT_PADDING
  const offsetY = -bounds.minY + EXPORT_PADDING

  const body = elements.map((element) => elementToSvg(element)).join('\n  ')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#ffffff" />
  <g transform="translate(${offsetX}, ${offsetY})">
  ${body}
  </g>
</svg>`

  downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), `whiteboard-${Date.now()}.svg`)
}
