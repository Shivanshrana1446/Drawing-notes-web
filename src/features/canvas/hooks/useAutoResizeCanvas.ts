import { useEffect } from 'react'
import type { RefObject } from 'react'

/** Keeps a canvas's backing-store resolution matched to its CSS size and the device pixel ratio. */
export function useAutoResizeCanvas(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onResize: () => void,
) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const dpr = window.devicePixelRatio || 1
      const nextWidth = Math.max(1, Math.round(entry.contentRect.width * dpr))
      const nextHeight = Math.max(1, Math.round(entry.contentRect.height * dpr))
      if (canvas.width !== nextWidth) canvas.width = nextWidth
      if (canvas.height !== nextHeight) canvas.height = nextHeight
      onResize()
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [canvasRef, onResize])
}
