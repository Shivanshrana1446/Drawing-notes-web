import { Maximize, ZoomIn, ZoomOut } from 'lucide-react'

import { IconButton } from '@/shared/components/IconButton'
import { Tooltip } from '@/shared/components/Tooltip'
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from '@/shared/constants'
import { clamp } from '@/shared/utils'
import { useWhiteboardStore } from '@/store'

export function ZoomControls() {
  const zoom = useWhiteboardStore((state) => state.zoom)
  const setZoomAtPoint = useWhiteboardStore((state) => state.setZoomAtPoint)
  const resetViewport = useWhiteboardStore((state) => state.resetViewport)

  function zoomBy(factor: number) {
    const next = clamp(zoom * factor, MIN_ZOOM, MAX_ZOOM)
    setZoomAtPoint(next, { x: window.innerWidth / 2, y: window.innerHeight / 2 })
  }

  return (
    <div className="pointer-events-auto flex items-center gap-0.5 rounded-xl bg-white px-1.5 py-1.5 shadow-panel">
      <Tooltip label="Zoom out">
        <IconButton
          icon={<ZoomOut size={18} />}
          label="Zoom out"
          onClick={() => zoomBy(1 / ZOOM_STEP)}
        />
      </Tooltip>
      <button
        type="button"
        onClick={resetViewport}
        className="min-w-14 rounded-lg px-2 py-1 text-center text-xs font-semibold text-gray-600 transition-colors hover:bg-surface-muted"
      >
        {Math.round(zoom * 100)}%
      </button>
      <Tooltip label="Zoom in">
        <IconButton icon={<ZoomIn size={18} />} label="Zoom in" onClick={() => zoomBy(ZOOM_STEP)} />
      </Tooltip>
      <Tooltip label="Reset view">
        <IconButton icon={<Maximize size={18} />} label="Reset view" onClick={resetViewport} />
      </Tooltip>
    </div>
  )
}
