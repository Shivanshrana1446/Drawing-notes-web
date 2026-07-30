interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
}

export function Slider({ label, value, min, max, step = 1, onChange, formatValue }: SliderProps) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-medium text-gray-500">
      <span className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-gray-400">{formatValue ? formatValue(value) : value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-border accent-accent"
      />
    </label>
  )
}
