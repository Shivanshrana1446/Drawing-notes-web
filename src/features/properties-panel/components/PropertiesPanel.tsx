import clsx from 'clsx'
import { useEffect, useRef } from 'react'

import type { DrawStyle } from '@/features/elements/types'
import { DRAW_TOOLS } from '@/features/tools/toolRegistry'
import { Slider } from '@/shared/components/Slider'
import {
  FILL_COLOR_PALETTE,
  OPACITY_MAX,
  OPACITY_MIN,
  STROKE_COLOR_PALETTE,
  STROKE_WIDTH_MAX,
  STROKE_WIDTH_MIN,
} from '@/shared/constants'
import type { DashStyle } from '@/shared/types/common'
import { useWhiteboardStore } from '@/store'

import { ColorPicker } from './ColorPicker'
import { TextStyleControls } from './TextStyleControls'

const DASH_OPTIONS: { value: DashStyle; label: string }[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
]

export function PropertiesPanel() {
  const activeTool = useWhiteboardStore((state) => state.activeTool)
  const selectedIds = useWhiteboardStore((state) => state.selectedIds)
  const elements = useWhiteboardStore((state) => state.elements)
  const currentStyle = useWhiteboardStore((state) => state.currentStyle)
  const setStyle = useWhiteboardStore((state) => state.setStyle)
  const updateElements = useWhiteboardStore((state) => state.updateElements)
  const commit = useWhiteboardStore((state) => state.commit)

  const hasCommittedRef = useRef(false)
  useEffect(() => {
    hasCommittedRef.current = false
  }, [selectedIds])

  function applyStyleChange(patch: Partial<DrawStyle>) {
    setStyle(patch)
    if (selectedIds.length > 0) {
      if (!hasCommittedRef.current) {
        commit()
        hasCommittedRef.current = true
      }
      updateElements(selectedIds, patch)
    }
  }

  const selectedElements = elements.filter((element) => selectedIds.includes(element.id))
  const hasShape = selectedElements.some(
    (element) => element.type === 'rectangle' || element.type === 'circle',
  )
  const hasText = selectedElements.some((element) => element.type === 'text')
  const showFill = activeTool === 'rectangle' || activeTool === 'circle' || hasShape
  const showText = activeTool === 'text' || hasText

  const isOnlyImages =
    selectedElements.length > 0 && selectedElements.every((element) => element.type === 'image')

  const isDrawingTool = DRAW_TOOLS.includes(activeTool) || activeTool === 'text'
  if (!isDrawingTool && (selectedIds.length === 0 || isOnlyImages)) return null

  return (
    <div className="pointer-events-auto flex w-56 max-w-full flex-col gap-3 overflow-y-auto rounded-xl bg-white p-3 shadow-panel [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ maxHeight: 'calc(100dvh - 6rem - env(safe-area-inset-top) - env(safe-area-inset-bottom))' }}>
      <ColorPicker
        label="Stroke"
        value={currentStyle.strokeColor}
        palette={STROKE_COLOR_PALETTE}
        onChange={(strokeColor) => applyStyleChange({ strokeColor })}
      />

      {showFill && (
        <ColorPicker
          label="Fill"
          value={currentStyle.fillColor}
          palette={FILL_COLOR_PALETTE}
          onChange={(fillColor) => applyStyleChange({ fillColor })}
        />
      )}

      <Slider
        label="Stroke width"
        value={currentStyle.strokeWidth}
        min={STROKE_WIDTH_MIN}
        max={STROKE_WIDTH_MAX}
        onChange={(strokeWidth) => applyStyleChange({ strokeWidth })}
      />

      <Slider
        label="Opacity"
        value={currentStyle.opacity}
        min={OPACITY_MIN}
        max={OPACITY_MAX}
        step={0.05}
        formatValue={(value) => `${Math.round(value * 100)}%`}
        onChange={(opacity) => applyStyleChange({ opacity })}
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-500">Stroke style</span>
        <div className="flex gap-1">
          {DASH_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => applyStyleChange({ dash: option.value })}
              className={clsx(
                'flex-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors',
                currentStyle.dash === option.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-surface-border text-gray-500 hover:bg-surface-muted',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {showText && <TextStyleControls style={currentStyle} onChange={applyStyleChange} />}
    </div>
  )
}
