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
  return (
    <header>
      <h1 className="logo">Probability Pattern Refinement</h1>
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
