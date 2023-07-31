import { Modal } from '../Modal/Modal'
import { WeaponsMap } from '../WeaponsMap/WeaponsMap'
import { WeaponsTable } from '../WeaponsTable/WeaponsTable'

import type { ReactElement } from 'react'

export interface EditorModalProps {
  showEditor: boolean
  onCloseEditor: () => void
}
export function EditorModal({
  showEditor,
  onCloseEditor,
}: EditorModalProps): ReactElement {
  return (
    <Modal
      className="fullscreen"
      open={showEditor}
      locked={false}
      onClose={onCloseEditor}
    >
      {showEditor && (
        <>
          <WeaponsTable />
          <WeaponsMap />
        </>
      )}
    </Modal>
  )
}
