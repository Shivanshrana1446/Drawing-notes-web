import type { StateCreator } from 'zustand'

import type { AppState } from '../types'

export interface SelectionSlice {
  selectedIds: string[]
  setSelectedIds: (ids: string[]) => void
  addToSelection: (ids: string[]) => void
  clearSelection: () => void
}

export const createSelectionSlice: StateCreator<AppState, [], [], SelectionSlice> = (set) => ({
  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  addToSelection: (ids) =>
    set((state) => ({ selectedIds: Array.from(new Set([...state.selectedIds, ...ids])) })),
  clearSelection: () => set({ selectedIds: [] }),
})
