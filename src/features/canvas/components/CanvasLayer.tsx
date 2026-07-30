import { useCallback, useEffect, useRef } from 'react'

import { boundsIntersect, getElementBounds } from '@/features/elements/geometry'
import { subscribeImageLoad } from '@/features/elements/imageCache'
import { renderElement } from '@/features/elements/renderers'
import { useWhiteboardStore } from '@/store'

import { useAutoResizeCanvas } from '../hooks/useAutoResizeCanvas'

export function CanvasLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const elements = useWhiteboardStore((state) => state.elements)
  const zoom = useWhiteboardStore((state) => state.zoom)
  const scrollX = useWhiteboardStore((state) => state.scrollX)
  const scrollY = useWhiteboardStore((state) => state.scrollY)
  const editingTextElementId = useWhiteboardStore((state) => state.editingTextElementId)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.setTransform(dpr * zoom, 0, 0, dpr * zoom, -scrollX * dpr * zoom, -scrollY * dpr * zoom)

    const visibleBounds = {
      minX: scrollX,
      minY: scrollY,
      maxX: scrollX + canvas.width / (dpr * zoom),
      maxY: scrollY + canvas.height / (dpr * zoom),
    }

    for (const element of elements) {
      if (element.id === editingTextElementId) continue
      if (!boundsIntersect(getElementBounds(element), visibleBounds)) continue
      renderElement(ctx, element)
    }
  }, [elements, zoom, scrollX, scrollY, editingTextElementId])

  useAutoResizeCanvas(canvasRef, draw)
  useEffect(() => draw(), [draw])
  useEffect(() => subscribeImageLoad(draw), [draw])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
}
