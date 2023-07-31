import { useStore } from '../../store'
import { Modal } from '../Modal/Modal'

import './NameModal.css'

import type { ChangeEventHandler, ReactElement, RefObject } from 'react'

interface NameModalProps {
  nameInputRef: RefObject<HTMLInputElement>
  showNameModal: boolean
  forceNameModal: boolean
  onCloseNameModal: () => void
  handleNameInput: ChangeEventHandler<HTMLInputElement>
}

export function NameModal({
  nameInputRef,
  showNameModal,
  forceNameModal,
  onCloseNameModal,
  handleNameInput,
}: NameModalProps): ReactElement {
  const { playerName } = useStore(({ playerName }) => ({
    playerName,
  }))

  return (
    <Modal
      className="name"
      open={showNameModal}
      locked={playerName === ''}
      onClose={onCloseNameModal}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="name">Employee Name</label>
        <input
          ref={nameInputRef}
          type="text"
          name="name"
          minLength={1}
          placeholder={playerName !== '' ? playerName : 'Mark S'}
          spellCheck={false}
          autoCorrect="off"
          autoComplete="name"
          onChange={handleNameInput}
        />
        <button
          formMethod="dialog"
          disabled={forceNameModal}
          onClick={onCloseNameModal}
        >
          Log In
        </button>
        {playerName !== '' && (
          <button
            formMethod="dialog"
            onClick={() => {
              if (nameInputRef.current != null) {
                nameInputRef.current.value = ''
              }
              onCloseNameModal()
            }}
          >
            Cancel
          </button>
        )}
      </form>
    </Modal>
  )
}
