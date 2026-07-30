import type { StateCreator } from 'zustand'

import type { DrawStyle } from '@/features/elements/types'
import { DEFAULT_FONT_SIZE, DEFAULT_OPACITY, DEFAULT_STROKE_WIDTH } from '@/shared/constants'

import type { AppState } from '../types'

export interface StyleSlice {
  currentStyle: DrawStyle
  setStyle: (patch: Partial<DrawStyle>) => void
}

const initialStyle: DrawStyle = {
  strokeColor: '#1e1e1e',
  fillColor: 'transparent',
  strokeWidth: DEFAULT_STROKE_WIDTH,
  opacity: DEFAULT_OPACITY,
  dash: 'solid',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: DEFAULT_FONT_SIZE,
  fontWeight: 'normal',
  fontStyle: 'normal',
  textDecoration: 'none',
  textColor: '#1e1e1e',
  textAlign: 'left',
}

export const createStyleSlice: StateCreator<AppState, [], [], StyleSlice> = (set) => ({
  currentStyle: initialStyle,
  setStyle: (patch) => set((state) => ({ currentStyle: { ...state.currentStyle, ...patch } })),
})
