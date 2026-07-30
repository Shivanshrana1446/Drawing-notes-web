import type { StateCreator } from 'zustand'

import type { ToolType } from '@/features/tools/types'

import type { AppState } from '../types'

export interface ToolSlice {
  activeTool: ToolType
  isToolLocked: boolean
  setActiveTool: (tool: ToolType) => void
  toggleToolLock: () => void
}

export const createToolSlice: StateCreator<AppState, [], [], ToolSlice> = (set) => ({
  activeTool: 'select',
  isToolLocked: false,
  setActiveTool: (tool) => set({ activeTool: tool }),
  toggleToolLock: () => set((state) => ({ isToolLocked: !state.isToolLocked })),
})
