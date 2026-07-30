import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'

import { measureTextBlock } from '@/features/elements/geometry'
import type { TextElement } from '@/features/elements/types'
import { useWhiteboardStore } from '@/store'

import { worldToScreen } from '../utils/coordinateTransform'

interface TextEditorOverlayProps {
  element: TextElement
  onCommit: (text: string) => void
}

export function TextEditorOverlay({ element, onCommit }: TextEditorOverlayProps) {
  const [text, setText] = useState(element.text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const zoom = useWhiteboardStore((state) => state.zoom)
  const scrollX = useWhiteboardStore((state) => state.scrollX)
  const scrollY = useWhiteboardStore((state) => state.scrollY)

  useEffect(() => {
    textareaRef.current?.focus()
    textareaRef.current?.select()
  }, [])

  const screenPoint = worldToScreen({ x: element.x, y: element.y }, { zoom, scrollX, scrollY })
  const measured = measureTextBlock(
    text || ' ',
    element.fontFamily,
    element.fontSize,
    element.fontWeight,
    element.fontStyle,
  )

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.currentTarget.blur()
    }
  }

  function stopPropagation(event: PointerEvent<HTMLTextAreaElement>) {
    event.stopPropagation()
  }

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={(event) => setText(event.target.value)}
      onBlur={() => onCommit(text)}
      onKeyDown={handleKeyDown}
      onPointerDown={stopPropagation}
      className="absolute resize-none overflow-hidden border border-dashed border-accent bg-white/70 outline-none"
      style={{
        left: screenPoint.x,
        top: screenPoint.y,
        width: Math.max(measured.width * zoom + 8, 40),
        height: Math.max(measured.height * zoom + 8, element.fontSize * zoom * 1.25),
        fontFamily: element.fontFamily,
        fontSize: element.fontSize * zoom,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        textDecoration: element.textDecoration,
        color: element.textColor,
        textAlign: element.textAlign,
        lineHeight: 1.25,
        padding: 0,
      }}
    />
  )
}
