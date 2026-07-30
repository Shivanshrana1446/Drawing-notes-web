import type { StateCreator } from 'zustand'

import type { WhiteboardElement } from '@/features/elements/types'

import type { AppState } from '../types'

export interface ElementsSlice {
  elements: WhiteboardElement[]
  addElement: (element: WhiteboardElement) => void
  updateElement: (id: string, patch: Partial<WhiteboardElement>) => void
  updateElements: (ids: string[], patch: Partial<WhiteboardElement>) => void
  removeElements: (ids: string[]) => void
  replaceElements: (elements: WhiteboardElement[]) => void
  bringToFront: (ids: string[]) => void
  sendToBack: (ids: string[]) => void
}

function partitionByIds(
  elements: WhiteboardElement[],
  ids: string[],
): [WhiteboardElement[], WhiteboardElement[]] {
  const idSet = new Set(ids)
  const matched: WhiteboardElement[] = []
  const rest: WhiteboardElement[] = []
  for (const element of elements) {
    if (idSet.has(element.id)) matched.push(element)
    else rest.push(element)
  }
  return [matched, rest]
}

export const createElementsSlice: StateCreator<AppState, [], [], ElementsSlice> = (set) => ({
  elements: [],

  addElement: (element) => set((state) => ({ elements: [...state.elements, element] })),

  updateElement: (id, patch) =>
    set((state) => ({
      elements: state.elements.map((element) =>
        element.id === id ? ({ ...element, ...patch } as WhiteboardElement) : element,
      ),
    })),

  updateElements: (ids, patch) =>
    set((state) => {
      const idSet = new Set(ids)
      return {
        elements: state.elements.map((element) =>
          idSet.has(element.id) ? ({ ...element, ...patch } as WhiteboardElement) : element,
        ),
      }
    }),

  removeElements: (ids) =>
    set((state) => {
      const idSet = new Set(ids)
      return { elements: state.elements.filter((element) => !idSet.has(element.id)) }
    }),

  replaceElements: (elements) => set({ elements }),

  bringToFront: (ids) =>
    set((state) => {
      const [matched, rest] = partitionByIds(state.elements, ids)
      return { elements: [...rest, ...matched] }
    }),

  sendToBack: (ids) =>
    set((state) => {
      const [matched, rest] = partitionByIds(state.elements, ids)
      return { elements: [...matched, ...rest] }
    }),
})
