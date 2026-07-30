const cache = new Map<string, HTMLImageElement>()
const listeners = new Set<() => void>()

/** Notifies subscribers (canvas layers) that a previously-unready image has finished loading. */
export function subscribeImageLoad(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function loadImage(src: string): HTMLImageElement {
  const img = new Image()
  img.onload = () => listeners.forEach((listener) => listener())
  img.src = src
  cache.set(src, img)
  return img
}

/** Returns the loaded image for `src`, or null while it's still loading (kicking off the load on first call). */
export function getCachedImage(src: string): HTMLImageElement | null {
  const existing = cache.get(src) ?? loadImage(src)
  return existing.complete && existing.naturalWidth > 0 ? existing : null
}

/** Resolves once `src` has finished loading — used by export, which needs pixels ready synchronously. */
export function ensureImageLoaded(src: string): Promise<HTMLImageElement> {
  const existing = cache.get(src) ?? loadImage(src)
  if (existing.complete && existing.naturalWidth > 0) return Promise.resolve(existing)
  return new Promise((resolve, reject) => {
    existing.addEventListener('load', () => resolve(existing))
    existing.addEventListener('error', () => reject(new Error(`Failed to load image: ${src}`)))
  })
}
