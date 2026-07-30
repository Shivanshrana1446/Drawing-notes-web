import { deleteTool } from './tools/deleteTool'
import { eraserTool } from './tools/eraserTool'
import { createFreehandTool } from './tools/freehandTool'
import { createLineTool } from './tools/lineTool'
import { moveTool } from './tools/moveTool'
import { selectTool } from './tools/selectTool'
import { createShapeTool } from './tools/shapeTool'
import { textTool } from './tools/textTool'
import type { ToolHandler, ToolType } from './types'

/** Tools that draw a single new element and should snap back to Select once locking is off. */
export const DRAW_TOOLS: ToolType[] = ['pencil', 'brush', 'rectangle', 'circle', 'line', 'arrow']

export const toolRegistry: Record<ToolType, ToolHandler> = {
  select: selectTool,
  move: moveTool,
  pencil: createFreehandTool('pencil'),
  brush: createFreehandTool('brush'),
  eraser: eraserTool,
  rectangle: createShapeTool('rectangle'),
  circle: createShapeTool('circle'),
  line: createLineTool('line'),
  arrow: createLineTool('arrow'),
  text: textTool,
  delete: deleteTool,
}
