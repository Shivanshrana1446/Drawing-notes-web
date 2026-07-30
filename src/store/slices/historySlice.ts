import type { StateCreator } from 'zustand'

import type { WhiteboardElement } from '@/features/elements/types'

import type { AppState } from '../types'

const MAX_HISTORY_ENTRIES = 100

export interface HistorySlice {
  past: WhiteboardElement[][]
  future: WhiteboardElement[][]
  /** Snapshots the current elements before a mutation. Call once per user gesture, before the first mutating action. */
  commit: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export const createHistorySlice: StateCreator<AppState, [], [], HistorySlice> = (set, get) => ({
  past: [],
  future: [],

  commit: () =>
    set((state) => ({
      past: [...state.past.slice(-MAX_HISTORY_ENTRIES + 1), state.elements],
      future: [],
    })),

  undo: () => {
    const { past, elements, future } = get()
    if (past.length === 0) return
    const previous = past[past.length - 1]
    set({
      past: past.slice(0, -1),
      elements: previous,
      future: [elements, ...future],
    })
  },

  redo: () => {
    const { future, elements, past } = get()
    if (future.length === 0) return
    const next = future[0]
    set({
      future: future.slice(1),
      elements: next,
      past: [...past, elements],
    })
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
})
