import type {
  DashStyle,
  FontStyle,
  FontWeight,
  Point,
  TextAlign,
  TextDecorationStyle,
} from '@/shared/types/common'

export type ElementType =
  | 'rectangle'
  | 'circle'
  | 'line'
  | 'arrow'
  | 'pencil'
  | 'brush'
  | 'text'
  | 'image'

export interface BaseElement {
  id: string
  x: number
  y: number
  width: number
  height: number
  strokeColor: string
  strokeWidth: number
  opacity: number
  dash: DashStyle
  createdAt: number
  updatedAt: number
}

export interface ShapeElement extends BaseElement {
  type: 'rectangle' | 'circle'
  fillColor: string
}

export interface LineElement extends BaseElement {
  type: 'line' | 'arrow'
  points: [Point, Point]
}

export interface FreehandElement extends BaseElement {
  type: 'pencil' | 'brush'
  points: Point[]
}

export interface TextElement extends BaseElement {
  type: 'text'
  text: string
  fontFamily: string
  fontSize: number
  fontWeight: FontWeight
  fontStyle: FontStyle
  textDecoration: TextDecorationStyle
  textColor: string
  textAlign: TextAlign
}

export interface ImageElement extends BaseElement {
  type: 'image'
  src: string
  naturalWidth: number
  naturalHeight: number
}

export type WhiteboardElement =
  | ShapeElement
  | LineElement
  | FreehandElement
  | TextElement
  | ImageElement

/** Current drawing defaults, applied to new elements and editable live on a selection. */
export interface DrawStyle {
  strokeColor: string
  fillColor: string
  strokeWidth: number
  opacity: number
  dash: DashStyle
  fontFamily: string
  fontSize: number
  fontWeight: FontWeight
  fontStyle: FontStyle
  textDecoration: TextDecorationStyle
  textColor: string
  textAlign: TextAlign
}

export interface SceneAppState {
  zoom: number
  scrollX: number
  scrollY: number
  gridEnabled: boolean
  backgroundColor: string
}

export interface Scene {
  schemaVersion: number
  elements: WhiteboardElement[]
  appState: SceneAppState
}
