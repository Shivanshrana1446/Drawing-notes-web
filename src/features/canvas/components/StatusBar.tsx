import { useWhiteboardStore } from '@/store'

export function StatusBar() {
  const zoom = useWhiteboardStore((state) => state.zoom)
  const elementCount = useWhiteboardStore((state) => state.elements.length)
  const selectedCount = useWhiteboardStore((state) => state.selectedIds.length)

  return (
    <div
      className="pointer-events-none absolute bottom-3 left-3 select-none rounded-lg bg-white/80 px-3 py-1.5 text-xs text-gray-500 shadow-panel backdrop-blur"
      style={{
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        left: 'calc(0.75rem + env(safe-area-inset-left))',
      }}
    >
      <span>{Math.round(zoom * 100)}% zoom</span>
      <span className="mx-2 text-gray-300">·</span>
      <span>
        {elementCount} element{elementCount === 1 ? '' : 's'}
      </span>
      {selectedCount > 0 && (
        <>
          <span className="mx-2 text-gray-300">·</span>
          <span>{selectedCount} selected</span>
        </>
      )}
    </div>
  )
}
