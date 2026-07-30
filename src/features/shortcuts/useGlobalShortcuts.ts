import { useEffect, useRef } from 'react'

import { translateElement } from '@/features/elements/geometry'
import type { WhiteboardElement } from '@/features/elements/types'
import type { ToolType } from '@/features/tools/types'
import { generateId } from '@/shared/utils'
import { useWhiteboardStore } from '@/store'

import { TOOL_SHORTCUTS } from './keymap'

const NUDGE_STEP = 1
const NUDGE_STEP_LARGE = 10
const PASTE_OFFSET = 20

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

/** Wires app-wide keyboard shortcuts: tool switching, undo/redo, delete, nudge, copy/paste, space-to-pan. */
export function useGlobalShortcuts() {
  const clipboardRef = useRef<WhiteboardElement[]>([])
  const previousToolRef = useRef<ToolType | null>(null)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return
      const state = useWhiteboardStore.getState()

      if (event.code === 'Space' && !event.repeat && state.activeTool !== 'move') {
        previousToolRef.current = state.activeTool
        state.setActiveTool('move')
        event.preventDefault()
        return
      }

      const key = event.key.toLowerCase()
      const isMod = event.ctrlKey || event.metaKey

      if (isMod && key === 'z' && event.shiftKey) {
        event.preventDefault()
        state.redo()
        return
      }
      if (isMod && key === 'z') {
        event.preventDefault()
        state.undo()
        return
      }
      if (isMod && key === 'y') {
        event.preventDefault()
        state.redo()
        return
      }
      if (isMod && key === 'a') {
        event.preventDefault()
        state.setSelectedIds(state.elements.map((element) => element.id))
        return
      }
      if (isMod && key === 'c') {
        if (state.selectedIds.length === 0) return
        const idSet = new Set(state.selectedIds)
        clipboardRef.current = state.elements.filter((element) => idSet.has(element.id))
        return
      }
      if (isMod && key === 'v') {
        if (clipboardRef.current.length === 0) return
        event.preventDefault()
        state.commit()
        const pasted = clipboardRef.current.map((element) => ({
          ...translateElement(element, PASTE_OFFSET, PASTE_OFFSET),
          id: generateId(),
        }))
        pasted.forEach((element) => state.addElement(element))
        state.setSelectedIds(pasted.map((element) => element.id))
        clipboardRef.current = pasted
        return
      }

      if (key === 'escape') {
        state.setSelectedIds([])
        return
      }

      if ((key === 'delete' || key === 'backspace') && state.selectedIds.length > 0) {
        event.preventDefault()
        state.commit()
        state.removeElements(state.selectedIds)
        state.setSelectedIds([])
        return
      }

      if (
        (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright') &&
        state.selectedIds.length > 0
      ) {
        event.preventDefault()
        const step = event.shiftKey ? NUDGE_STEP_LARGE : NUDGE_STEP
        const dx = key === 'arrowleft' ? -step : key === 'arrowright' ? step : 0
        const dy = key === 'arrowup' ? -step : key === 'arrowdown' ? step : 0
        if (!event.repeat) state.commit()
        const idSet = new Set(state.selectedIds)
        for (const element of state.elements) {
          if (idSet.has(element.id))
            state.updateElement(element.id, translateElement(element, dx, dy))
        }
        return
      }

      if (!isMod && key in TOOL_SHORTCUTS) {
        state.setActiveTool(TOOL_SHORTCUTS[key])
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.code === 'Space' && previousToolRef.current) {
        useWhiteboardStore.getState().setActiveTool(previousToolRef.current)
        previousToolRef.current = null
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
}
