import clsx from 'clsx'

interface ColorPickerProps {
  label: string
  value: string
  palette: readonly string[]
  onChange: (color: string) => void
}

const TRANSPARENT_SWATCH_STYLE = {
  backgroundImage:
    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
}

export function ColorPicker({ label, value, palette, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <div className="flex flex-wrap items-center gap-1.5">
        {palette.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color === 'transparent' ? 'Transparent' : color}
            onClick={() => onChange(color)}
            className={clsx(
              'h-6 w-6 rounded-md border transition-transform hover:scale-110',
              value === color ? 'ring-2 ring-accent ring-offset-1' : 'border-surface-border',
            )}
            style={color === 'transparent' ? TRANSPARENT_SWATCH_STYLE : { backgroundColor: color }}
          />
        ))}
        <label className="relative h-6 w-6 cursor-pointer overflow-hidden rounded-md border border-surface-border">
          <input
            type="color"
            value={value === 'transparent' ? '#ffffff' : value}
            onChange={(event) => onChange(event.target.value)}
            className="absolute -left-1 -top-1 h-8 w-8 cursor-pointer"
            aria-label={`Custom ${label.toLowerCase()}`}
          />
        </label>
      </div>
    </div>
  )
}
