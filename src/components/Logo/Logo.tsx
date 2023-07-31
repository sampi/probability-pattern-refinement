import { useLayoutEffect } from 'react'
import { shallow } from 'zustand/shallow'

import { useStore } from '../../store'
import { getGameTitle } from '../../utils'

import type { ReactElement } from 'react'

export function Logo(): ReactElement {
  const { weaponsArr } = useStore(
    (state) => ({
      weaponsArr: Object.values(state.weapons),
    }),
    shallow,
  )

  useLayoutEffect(() => {
    document.title = getGameTitle(weaponsArr)
  }, [weaponsArr])

  return <h1 className="logo">{getGameTitle(weaponsArr)}</h1>
}
