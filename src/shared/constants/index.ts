export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 8
export const ZOOM_STEP = 1.15
export const DEFAULT_GRID_SIZE = 20

export const DEFAULT_STROKE_WIDTH = 2
export const DEFAULT_OPACITY = 1
export const DEFAULT_FONT_SIZE = 20

export const STROKE_WIDTH_MIN = 1
export const STROKE_WIDTH_MAX = 40

export const OPACITY_MIN = 0.1
export const OPACITY_MAX = 1

export const FONT_SIZE_MIN = 8
export const FONT_SIZE_MAX = 160

export const FONT_FAMILIES = [
  { label: 'Hand-drawn', value: '"Comic Sans MS", "Segoe Print", cursive' },
  { label: 'Sans', value: 'Inter, system-ui, sans-serif' },
  { label: 'Serif', value: 'Georgia, "Times New Roman", serif' },
  { label: 'Mono', value: '"Cascadia Code", "Courier New", monospace' },
] as const

export const STROKE_COLOR_PALETTE = [
  '#1e1e1e',
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#9c36b5',
  '#ffffff',
] as const

export const FILL_COLOR_PALETTE = [
  'transparent',
  '#ffc9c9',
  '#b2f2bb',
  '#a5d8ff',
  '#ffec99',
  '#eebefa',
  '#1e1e1e',
] as const

export const CANVAS_BACKGROUND = '#f5f6f8'
export const SCENE_SCHEMA_VERSION = 1
