import { Download, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'

import { IconButton } from '@/shared/components/IconButton'
import { Tooltip } from '@/shared/components/Tooltip'

import { exportToJPEG } from '../export/exportToJPEG'
import { exportToJSON } from '../export/exportToJSON'
import { exportToPNG } from '../export/exportToPNG'
import { exportToSVG } from '../export/exportToSVG'
import { importFromJSON } from '../import/importFromJSON'
import { importImageFile } from '../import/importImageFile'

const EXPORT_OPTIONS = [
  { label: 'PNG image', action: exportToPNG },
  { label: 'JPEG image', action: exportToJPEG },
  { label: 'SVG vector', action: exportToSVG },
  { label: 'JSON scene', action: exportToJSON },
]

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImportChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const isJson = file.type === 'application/json' || file.name.toLowerCase().endsWith('.json')
      if (isJson) {
        await importFromJSON(file)
      } else {
        await importImageFile(file)
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Failed to import file.')
    }
  }

  return (
    <div className="pointer-events-auto relative">
      <Tooltip label="Export or import">
        <IconButton
          icon={<Download size={18} />}
          label="Export"
          active={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        />
      </Tooltip>

      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 top-full z-10 mt-2 w-40 overflow-hidden rounded-lg bg-white py-1 shadow-panel"
        >
          {EXPORT_OPTIONS.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                option.action()
                setIsOpen(false)
              }}
              className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-surface-muted"
            >
              {option.label}
            </button>
          ))}
          <div className="my-1 h-px bg-surface-border" />
          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click()
              setIsOpen(false)
            }}
            className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-sm text-gray-700 hover:bg-surface-muted"
          >
            <Upload size={14} /> Import file
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json,image/png,image/jpeg,image/svg+xml,.png,.jpg,.jpeg,.svg"
        className="hidden"
        onChange={handleImportChange}
      />
    </div>
  )
}
