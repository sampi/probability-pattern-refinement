import { useStore } from '../../store'
import { Modal } from '../Modal/Modal'

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
      open={showNameModal}
      locked={playerName === ''}
      onClose={onCloseNameModal}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          ref={nameInputRef}
          type="text"
          name="name"
          minLength={1}
          placeholder=""
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
          Let’s play!
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
            cancel
          </button>
        )}
      </form>
    </Modal>
  )
}
