import { shallow } from 'zustand/shallow'

import { useStore } from '../../store'

import './WeaponPicker.css'

import type { Weapon } from '../../store'
import type { Dispatch, ReactElement, SetStateAction } from 'react'

interface WeaponPickerProps {
  playerWeapon: Weapon | null
  setPlayerWeapon: Dispatch<SetStateAction<WeaponPickerProps['playerWeapon']>>
}

export function WeaponPicker({
  playerWeapon,
  setPlayerWeapon,
}: WeaponPickerProps): ReactElement {
  const { weaponsArr } = useStore(
    (state) => ({
      weaponsArr: Object.values(state.weapons),
    }),
    shallow,
  )

  return (
    <ul className="weapons">
      {weaponsArr.map((weapon) => (
        <li
          key={weapon.id}
          className={['weapon', weapon.id === playerWeapon?.id && 'active']
            .filter(Boolean)
            .join(' ')}
        >
          <button
            onClick={() => {
              setPlayerWeapon(weapon)
            }}
          >
            {weapon.name}
          </button>
        </li>
      ))}
    </ul>
  )
}
