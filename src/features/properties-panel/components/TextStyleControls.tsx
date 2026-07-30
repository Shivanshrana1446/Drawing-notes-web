import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from 'lucide-react'

import type { DrawStyle } from '@/features/elements/types'
import { IconButton } from '@/shared/components/IconButton'
import { Slider } from '@/shared/components/Slider'
import {
  FONT_FAMILIES,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
  STROKE_COLOR_PALETTE,
} from '@/shared/constants'

import { ColorPicker } from './ColorPicker'

interface TextStyleControlsProps {
  style: DrawStyle
  onChange: (patch: Partial<DrawStyle>) => void
}

export function TextStyleControls({ style, onChange }: TextStyleControlsProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-surface-border pt-3">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-gray-500">Font family</span>
        <select
          value={style.fontFamily}
          onChange={(event) => onChange({ fontFamily: event.target.value })}
          className="rounded-md border border-surface-border bg-white px-2 py-1.5 text-sm"
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <Slider
        label="Font size"
        value={style.fontSize}
        min={FONT_SIZE_MIN}
        max={FONT_SIZE_MAX}
        onChange={(fontSize) => onChange({ fontSize })}
      />

      <div className="flex items-center gap-1">
        <IconButton
          icon={<Bold size={16} />}
          label="Bold"
          active={style.fontWeight === 'bold'}
          onClick={() => onChange({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' })}
        />
        <IconButton
          icon={<Italic size={16} />}
          label="Italic"
          active={style.fontStyle === 'italic'}
          onClick={() =>
            onChange({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })
          }
        />
        <IconButton
          icon={<Underline size={16} />}
          label="Underline"
          active={style.textDecoration === 'underline'}
          onClick={() =>
            onChange({
              textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline',
            })
          }
        />
      </div>

      <div className="flex items-center gap-1">
        <IconButton
          icon={<AlignLeft size={16} />}
          label="Align left"
          active={style.textAlign === 'left'}
          onClick={() => onChange({ textAlign: 'left' })}
        />
        <IconButton
          icon={<AlignCenter size={16} />}
          label="Align center"
          active={style.textAlign === 'center'}
          onClick={() => onChange({ textAlign: 'center' })}
        />
        <IconButton
          icon={<AlignRight size={16} />}
          label="Align right"
          active={style.textAlign === 'right'}
          onClick={() => onChange({ textAlign: 'right' })}
        />
      </div>

      <ColorPicker
        label="Text color"
        value={style.textColor}
        palette={STROKE_COLOR_PALETTE}
        onChange={(textColor) => onChange({ textColor })}
      />
    </div>
  )
}
