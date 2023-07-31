import { Modal } from '../Modal/Modal'
import { WeaponsMap } from '../WeaponsMap/WeaponsMap'
import { WeaponsTable } from '../WeaponsTable/WeaponsTable'

import './EditorModal.css'

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
      className="editor"
      open={showEditor}
      locked={false}
      onClose={onCloseEditor}
    >
      {showEditor && (
        <>
          <WeaponsTable />
          <WeaponsMap />
          <div className="exit">
            <button onClick={onCloseEditor}>Return</button>
          </div>
        </>
      )}
    </Modal>
  )
}
