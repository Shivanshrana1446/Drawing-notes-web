import {
  ArrowRight,
  Circle,
  Eraser,
  Hand,
  Lock,
  Minus,
  MousePointer2,
  Paintbrush,
  Pencil,
  Redo2,
  Square,
  Trash2,
  Type,
  Undo2,
  Unlock,
} from 'lucide-react'
import type { ReactNode } from 'react'

import { getShortcutLabel } from '@/features/shortcuts/keymap'
import { Divider } from '@/shared/components/Divider'
import { IconButton } from '@/shared/components/IconButton'
import { Tooltip } from '@/shared/components/Tooltip'
import { useWhiteboardStore } from '@/store'

import type { ToolType } from '../types'

interface ToolDefinition {
  type: ToolType
  label: string
  icon: ReactNode
}

const TOOLS: ToolDefinition[] = [
  { type: 'select', label: 'Select', icon: <MousePointer2 size={18} /> },
  { type: 'move', label: 'Pan canvas', icon: <Hand size={18} /> },
  { type: 'pencil', label: 'Pencil', icon: <Pencil size={18} /> },
  { type: 'brush', label: 'Brush', icon: <Paintbrush size={18} /> },
  { type: 'eraser', label: 'Eraser', icon: <Eraser size={18} /> },
  { type: 'rectangle', label: 'Rectangle', icon: <Square size={18} /> },
  { type: 'circle', label: 'Circle', icon: <Circle size={18} /> },
  { type: 'line', label: 'Line', icon: <Minus size={18} /> },
  { type: 'arrow', label: 'Arrow', icon: <ArrowRight size={18} /> },
  { type: 'text', label: 'Text', icon: <Type size={18} /> },
  { type: 'delete', label: 'Click to delete', icon: <Trash2 size={18} /> },
]

export function Toolbar() {
  const activeTool = useWhiteboardStore((state) => state.activeTool)
  const setActiveTool = useWhiteboardStore((state) => state.setActiveTool)
  const isToolLocked = useWhiteboardStore((state) => state.isToolLocked)
  const toggleToolLock = useWhiteboardStore((state) => state.toggleToolLock)
  const undo = useWhiteboardStore((state) => state.undo)
  const redo = useWhiteboardStore((state) => state.redo)
  const canUndo = useWhiteboardStore((state) => state.past.length > 0)
  const canRedo = useWhiteboardStore((state) => state.future.length > 0)

  return (
    <div className="pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-xl bg-white px-1.5 py-1.5 shadow-panel [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {TOOLS.map((tool) => (
        <Tooltip key={tool.type} label={`${tool.label} (${getShortcutLabel(tool.type)})`}>
          <IconButton
            icon={tool.icon}
            label={tool.label}
            active={activeTool === tool.type}
            onClick={() => setActiveTool(tool.type)}
          />
        </Tooltip>
      ))}

      <Divider />

      <Tooltip
        label={
          isToolLocked ? 'Tool stays active after drawing' : 'Switches to Select after drawing'
        }
      >
        <IconButton
          icon={isToolLocked ? <Lock size={18} /> : <Unlock size={18} />}
          label="Toggle tool lock"
          active={isToolLocked}
          onClick={toggleToolLock}
        />
      </Tooltip>

      <Divider />

      <Tooltip label="Undo (Ctrl+Z)">
        <IconButton icon={<Undo2 size={18} />} label="Undo" onClick={undo} disabled={!canUndo} />
      </Tooltip>
      <Tooltip label="Redo (Ctrl+Shift+Z)">
        <IconButton icon={<Redo2 size={18} />} label="Redo" onClick={redo} disabled={!canRedo} />
      </Tooltip>
    </div>
  )
}
