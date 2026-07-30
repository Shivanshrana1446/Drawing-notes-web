import { createImageElement } from '@/features/elements/factories/createElement'
import { screenToWorld } from '@/features/canvas/utils/coordinateTransform'
import { useWhiteboardStore } from '@/store'

const MAX_PLACED_DIMENSION = 480

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read the file.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to decode the image.'))
    img.src = src
  })
}

/** Imports a PNG/JPEG/SVG file as a new image element, placed centered in the current viewport. */
export async function importImageFile(file: File): Promise<void> {
  const src = await readFileAsDataUrl(file)
  const img = await loadImage(src)

  const naturalWidth = img.naturalWidth || img.width
  const naturalHeight = img.naturalHeight || img.height
  const scale = Math.min(1, MAX_PLACED_DIMENSION / Math.max(naturalWidth, naturalHeight))
  const width = naturalWidth * scale
  const height = naturalHeight * scale

  const state = useWhiteboardStore.getState()
  const viewportCenter = screenToWorld(
    { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    state,
  )
  const origin = { x: viewportCenter.x - width / 2, y: viewportCenter.y - height / 2 }

  const element = createImageElement(origin, { width, height }, src)
  state.commit()
  state.addElement(element)
  state.setSelectedIds([element.id])
}
