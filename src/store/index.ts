import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { createElementsSlice } from './slices/elementsSlice'
import { createHistorySlice } from './slices/historySlice'
import { createSelectionSlice } from './slices/selectionSlice'
import { createStyleSlice } from './slices/styleSlice'
import { createToolSlice } from './slices/toolSlice'
import { createUiSlice } from './slices/uiSlice'
import { createViewportSlice } from './slices/viewportSlice'
import type { AppState } from './types'

const PERSIST_KEY = 'whiteboard-storage'

/** Wraps localStorage so a quota error (e.g. large embedded images) logs instead of crashing the app. */
const safeLocalStorage = {
  getItem: (name: string) => localStorage.getItem(name),
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value)
    } catch (error) {
      console.error('Could not save the whiteboard (storage may be full):', error)
    }
  },
  removeItem: (name: string) => localStorage.removeItem(name),
}

export const useWhiteboardStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createElementsSlice(...a),
      ...createSelectionSlice(...a),
      ...createToolSlice(...a),
      ...createStyleSlice(...a),
      ...createViewportSlice(...a),
      ...createHistorySlice(...a),
      ...createUiSlice(...a),
    }),
    {
      name: PERSIST_KEY,
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        elements: state.elements,
        zoom: state.zoom,
        scrollX: state.scrollX,
        scrollY: state.scrollY,
        gridEnabled: state.gridEnabled,
        snapToGridEnabled: state.snapToGridEnabled,
        currentStyle: state.currentStyle,
      }),
    },
  ),
)

export type { AppState } from './types'
