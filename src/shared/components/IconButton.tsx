import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
  active?: boolean
}

export function IconButton({ icon, label, active = false, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={clsx(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-600 transition-colors',
        'hover:bg-surface-muted hover:text-gray-900',
        'disabled:cursor-not-allowed disabled:opacity-40',
        active && 'bg-accent/10 text-accent hover:bg-accent/10 hover:text-accent',
        className,
      )}
      {...rest}
    >
      {icon}
    </button>
  )
}
