import { useCallback, useEffect, useRef } from 'react'

import { useWhiteboardStore } from '@/store'

import { useAutoResizeCanvas } from '../hooks/useAutoResizeCanvas'

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor
}

export function GridLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const zoom = useWhiteboardStore((state) => state.zoom)
  const scrollX = useWhiteboardStore((state) => state.scrollX)
  const scrollY = useWhiteboardStore((state) => state.scrollY)
  const gridEnabled = useWhiteboardStore((state) => state.gridEnabled)
  const gridSize = useWhiteboardStore((state) => state.gridSize)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!gridEnabled) return

    const dpr = window.devicePixelRatio || 1
    const spacing = gridSize * zoom
    if (spacing < 6) return

    const offsetX = positiveModulo(-scrollX * zoom, spacing) * dpr
    const offsetY = positiveModulo(-scrollY * zoom, spacing) * dpr
    const step = spacing * dpr
    const radius = Math.min(1.4, spacing / 20) * dpr

    ctx.fillStyle = 'rgba(60, 64, 74, 0.22)'
    for (let x = offsetX; x < canvas.width; x += step) {
      for (let y = offsetY; y < canvas.height; y += step) {
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }, [zoom, scrollX, scrollY, gridEnabled, gridSize])

  useAutoResizeCanvas(canvasRef, draw)
  useEffect(() => draw(), [draw])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
}
