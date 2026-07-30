export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export type DashStyle = 'solid' | 'dashed' | 'dotted'

export type FontWeight = 'normal' | 'bold'
export type FontStyle = 'normal' | 'italic'
export type TextDecorationStyle = 'none' | 'underline'
export type TextAlign = 'left' | 'center' | 'right'
