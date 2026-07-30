import type { StateCreator } from 'zustand'

import type { AppState } from '../types'

export interface UiSlice {
  editingTextElementId: string | null
  isExportMenuOpen: boolean
  setEditingTextElementId: (id: string | null) => void
  setExportMenuOpen: (open: boolean) => void
}

export const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set) => ({
  editingTextElementId: null,
  isExportMenuOpen: false,
  setEditingTextElementId: (id) => set({ editingTextElementId: id }),
  setExportMenuOpen: (open) => set({ isExportMenuOpen: open }),
})
