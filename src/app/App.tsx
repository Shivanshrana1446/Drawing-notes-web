import { CanvasStage } from '@/features/canvas/components/CanvasStage'
import { ExportMenu } from '@/features/io/components/ExportMenu'
import { PropertiesPanel } from '@/features/properties-panel/components/PropertiesPanel'
import { useGlobalShortcuts } from '@/features/shortcuts/useGlobalShortcuts'
import { Toolbar } from '@/features/tools/components/Toolbar'

export function App() {
  useGlobalShortcuts()

  return (
    <div className="relative h-dvh w-dvw overflow-hidden bg-surface-muted font-sans">
      <CanvasStage />

      <div
        className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center px-2"
        style={{ top: 'calc(0.75rem + env(safe-area-inset-top))' }}
      >
        <Toolbar />
      </div>

      <div
        className="pointer-events-none absolute left-3 top-16 z-10 max-w-[calc(100dvw-1.5rem)]"
        style={{ top: 'calc(4rem + env(safe-area-inset-top))' }}
      >
        <PropertiesPanel />
      </div>

      <div
        className="pointer-events-none absolute right-3 top-3 z-10"
        style={{
          top: 'calc(0.75rem + env(safe-area-inset-top))',
          right: 'calc(0.75rem + env(safe-area-inset-right))',
        }}
      >
        <ExportMenu />
      </div>
    </div>
  )
}
