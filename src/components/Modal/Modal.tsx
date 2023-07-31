import { useCallback, useEffect, useMemo, useRef } from 'react'

import './Modal.css'

import type {
  PropsWithChildren,
  ReactElement,
  MouseEventHandler,
  ReactEventHandler,
  AnimationEventHandler,
} from 'react'

interface ModalProps extends PropsWithChildren {
  open: HTMLDialogElement['open']
  locked: boolean
  className?: HTMLDialogElement['className']
  onClose: () => void
}

/**
 * @see https://dev.to/link2twenty/react-using-native-dialogs-to-make-a-modal-popup-4b25
 */
export function Modal({
  open,
  locked,
  onClose,
  className = '',
  children,
}: ModalProps): ReactElement {
  const modalRef = useRef<HTMLDialogElement | null>(null)

  const nextClassName = useMemo(
    () => ['modal', !open && 'is-closing', className].filter(Boolean).join(' '),
    [className, open],
  )

  const onCancel: ReactEventHandler<HTMLDialogElement> = useCallback(
    (event) => {
      event.preventDefault()
      if (!locked) {
        onClose()
      }
    },
    [locked, onClose],
  )

  const onClick: MouseEventHandler<HTMLDialogElement> = useCallback(
    (event) => {
      if (event.target === modalRef.current && !locked) {
        onClose()
      }
    },
    [locked, onClose],
  )

  const onAnimationEnd: AnimationEventHandler<HTMLDialogElement> =
    useCallback(() => {
      if (!open) {
        modalRef?.current?.close()
      }
    }, [open])

  useEffect(() => {
    if (open) {
      modalRef?.current?.showModal()
    }
  }, [open])

  return (
    <dialog
      ref={modalRef}
      className={nextClassName}
      onClose={onClose}
      onCancel={onCancel}
      onClick={onClick}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="container">{children}</div>
    </dialog>
  )
}
