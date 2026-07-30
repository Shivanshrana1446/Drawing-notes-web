import type { StateCreator } from 'zustand'

import { DEFAULT_GRID_SIZE, MAX_ZOOM, MIN_ZOOM } from '@/shared/constants'
import type { Point } from '@/shared/types/common'
import { clamp } from '@/shared/utils'

import type { AppState } from '../types'

export interface ViewportSlice {
  zoom: number
  scrollX: number
  scrollY: number
  gridEnabled: boolean
  snapToGridEnabled: boolean
  gridSize: number
  setZoomAtPoint: (nextZoom: number, focalScreenPoint: Point) => void
  panBy: (dxScreen: number, dyScreen: number) => void
  toggleGrid: () => void
  toggleSnapToGrid: () => void
  resetViewport: () => void
  setViewport: (
    partial: Partial<{ zoom: number; scrollX: number; scrollY: number; gridEnabled: boolean }>,
  ) => void
}

export const createViewportSlice: StateCreator<AppState, [], [], ViewportSlice> = (set, get) => ({
  zoom: 1,
  scrollX: 0,
  scrollY: 0,
  gridEnabled: true,
  snapToGridEnabled: false,
  gridSize: DEFAULT_GRID_SIZE,

  setZoomAtPoint: (nextZoom, focalScreenPoint) => {
    const { zoom, scrollX, scrollY } = get()
    const clamped = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM)
    const worldUnderCursor = {
      x: focalScreenPoint.x / zoom + scrollX,
      y: focalScreenPoint.y / zoom + scrollY,
    }
    set({
      zoom: clamped,
      scrollX: worldUnderCursor.x - focalScreenPoint.x / clamped,
      scrollY: worldUnderCursor.y - focalScreenPoint.y / clamped,
    })
  },

  panBy: (dxScreen, dyScreen) =>
    set((state) => ({
      scrollX: state.scrollX - dxScreen / state.zoom,
      scrollY: state.scrollY - dyScreen / state.zoom,
    })),

  toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
  toggleSnapToGrid: () => set((state) => ({ snapToGridEnabled: !state.snapToGridEnabled })),
  resetViewport: () => set({ zoom: 1, scrollX: 0, scrollY: 0 }),
  setViewport: (partial) => set(partial),
})
