import { useLayoutEffect } from 'react'

import { TITLE } from '../../constants'

import './Header.css'

import type { Dispatch, ReactElement, SetStateAction } from 'react'

interface HeaderProps {
  disableEditor: boolean
  setShowEditor: Dispatch<SetStateAction<boolean>>
}

export function Header({
  disableEditor,
  setShowEditor,
}: HeaderProps): ReactElement {
  /**
   * This is here so we only have to specify the title in a single place in the code,
   * plus we get a nice "Loading..." indicator in the browser tab,
   * in case the connection is extremely slow
   */
  useLayoutEffect(() => {
    document.title = TITLE
  }, [])

  return (
    <header>
      <h1 className="logo">{TITLE}</h1>
      <button
        className="show-editor"
        disabled={disableEditor}
        onClick={() => {
          setShowEditor(true)
        }}
      >
        Edit apparatus & axioms
      </button>
    </header>
  )
}
