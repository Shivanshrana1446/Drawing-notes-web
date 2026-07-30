import type { ElementsSlice } from './slices/elementsSlice'
import type { HistorySlice } from './slices/historySlice'
import type { SelectionSlice } from './slices/selectionSlice'
import type { StyleSlice } from './slices/styleSlice'
import type { ToolSlice } from './slices/toolSlice'
import type { UiSlice } from './slices/uiSlice'
import type { ViewportSlice } from './slices/viewportSlice'

export type AppState = ElementsSlice &
  SelectionSlice &
  ToolSlice &
  StyleSlice &
  ViewportSlice &
  HistorySlice &
  UiSlice
