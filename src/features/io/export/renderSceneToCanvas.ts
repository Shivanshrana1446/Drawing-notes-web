import { getElementBounds, unionBounds } from '@/features/elements/geometry'
import { ensureImageLoaded } from '@/features/elements/imageCache'
import { renderElement } from '@/features/elements/renderers'
import type { WhiteboardElement } from '@/features/elements/types'

const EXPORT_PADDING = 40
const EXPORT_SCALE = 2
const FALLBACK_BOUNDS = { minX: 0, minY: 0, maxX: 800, maxY: 600 }

/** Renders the full scene content (independent of the current pan/zoom) onto a fresh offscreen canvas. */
export async function renderSceneToCanvas(
  elements: WhiteboardElement[],
  backgroundColor: string | null,
): Promise<HTMLCanvasElement> {
  await Promise.all(
    elements.filter((element) => element.type === 'image').map((element) => ensureImageLoaded(element.src)),
  )

  const bounds =
    unionBounds(elements.map((element) => getElementBounds(element))) ?? FALLBACK_BOUNDS
  const width = bounds.maxX - bounds.minX + EXPORT_PADDING * 2
  const height = bounds.maxY - bounds.minY + EXPORT_PADDING * 2

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width * EXPORT_SCALE))
  canvas.height = Math.max(1, Math.round(height * EXPORT_SCALE))

  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  if (backgroundColor) {
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.setTransform(
    EXPORT_SCALE,
    0,
    0,
    EXPORT_SCALE,
    (-bounds.minX + EXPORT_PADDING) * EXPORT_SCALE,
    (-bounds.minY + EXPORT_PADDING) * EXPORT_SCALE,
  )

  for (const element of elements) {
    renderElement(ctx, element)
  }

  return canvas
}
