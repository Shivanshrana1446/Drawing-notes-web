import type { RefObject } from 'react'

import { useAutoResizeCanvas } from '../hooks/useAutoResizeCanvas'

interface InteractionLayerProps {
  canvasRef: RefObject<HTMLCanvasElement | null>
  onResize: () => void
}

/**
 * Renders the in-progress draft element (while drawing) and the marquee selection preview.
 * Driven imperatively by CanvasStage — it owns the draft/drag refs this layer paints from.
 */
export function InteractionLayer({ canvasRef, onResize }: InteractionLayerProps) {
  useAutoResizeCanvas(canvasRef, onResize)
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
}
