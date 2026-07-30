interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
}

export function Divider({ orientation = 'vertical' }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={
        orientation === 'vertical'
          ? 'mx-1 h-6 w-px bg-surface-border'
          : 'my-1 h-px w-full bg-surface-border'
      }
    />
  )
}
