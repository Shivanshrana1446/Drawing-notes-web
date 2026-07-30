import { getElementBounds, unionBounds } from '@/features/elements/geometry'
import type { WhiteboardElement } from '@/features/elements/types'
import type { Bounds } from '@/shared/types/common'

export function getSelectionBounds(
  elements: WhiteboardElement[],
  selectedIds: string[],
): Bounds | null {
  if (selectedIds.length === 0) return null
  const idSet = new Set(selectedIds)
  const selected = elements.filter((element) => idSet.has(element.id))
  return unionBounds(selected.map((element) => getElementBounds(element)))
}
