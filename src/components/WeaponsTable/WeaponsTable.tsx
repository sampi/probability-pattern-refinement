import { useCallback, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { COLORS } from '../../constants'
import { useStore } from '../../store'
import { PlayResult, getPlayResult } from '../../utils'

import './WeaponsTable.css'

import type { ReactElement, MouseEventHandler, ChangeEventHandler } from 'react'

export function WeaponsTable(): ReactElement {
  const weaponInputRef = useRef<HTMLInputElement>(null)
  const [newWeaponName, setNewWeaponName] = useState<string>('')

  const { toggleWeaponDefeat, deleteWeapon, createWeapon } = useStore(
    (state) => ({
      playerName: state.playerName,
      setPlayer: state.setPlayer,

      toggleWeaponDefeat: state.toggleWeaponDefeat,
      deleteWeapon: state.deleteWeapon,
      createWeapon: state.createWeapon,

      incrementWins: state.incrementWins,
      incrementLosses: state.incrementLosses,
      incrementDraws: state.incrementDraws,
    }),
  )

  const { weaponsArr } = useStore(
    (state) => ({
      weaponsArr: Object.values(state.weapons),
    }),
    shallow,
  )

  const addWeapon: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    if (newWeaponName !== '') {
      createWeapon(newWeaponName)

      if (weaponInputRef.current != null) {
        weaponInputRef.current.value = ''
        setNewWeaponName('')
      }
    }
  }, [createWeapon, newWeaponName])

  const handleWeaponInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setNewWeaponName(event.target.value)
    },
    [],
  )

  return (
    <table className="weapons-table">
      <thead>
        <tr>
          <th>
            <div>Opponent</div>
            <div>Player</div>
          </th>
          {weaponsArr.map((weapon, index) => (
            <th
              key={weapon.id}
              style={{ color: COLORS[index % COLORS.length] }}
            >
              {weapon.name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {weaponsArr.map((playerWeapon, index) => (
          <tr key={playerWeapon.id}>
            <th style={{ color: COLORS[index % COLORS.length] }}>
              {playerWeapon.name}
              <button
                onClick={() => {
                  deleteWeapon(playerWeapon.id)
                }}
                disabled={weaponsArr.length < 4}
              >
                -
              </button>
            </th>
            {weaponsArr.map((enemyWeapon) => (
              <td key={`${enemyWeapon.id}-${playerWeapon.id}`}>
                <button
                  className={[
                    getPlayResult(playerWeapon, enemyWeapon) ===
                      PlayResult.Win && 'win',
                    getPlayResult(playerWeapon, enemyWeapon) ===
                      PlayResult.Lose && 'lose',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={
                    getPlayResult(playerWeapon, enemyWeapon) === PlayResult.Draw
                  }
                  onClick={() => {
                    toggleWeaponDefeat(playerWeapon, enemyWeapon)
                  }}
                >
                  {getPlayResult(playerWeapon, enemyWeapon).toString()}
                </button>
              </td>
            ))}
          </tr>
        ))}
        {weaponsArr.length >= 3 && weaponsArr.length < 12 && (
          <tr>
            <th className="new-weapon">
              <form
                onSubmit={(event) => {
                  event.preventDefault()
                }}
              >
                <label htmlFor="weaponName">New Weapon</label>
                <input
                  ref={weaponInputRef}
                  type="text"
                  name="weaponName"
                  minLength={1}
                  placeholder=""
                  spellCheck={true}
                  autoCorrect="on"
                  autoComplete="off"
                  onChange={handleWeaponInput}
                />
                <button onClick={addWeapon} disabled={newWeaponName === ''}>
                  +
                </button>
              </form>
            </th>
          </tr>
        )}
      </tbody>
    </table>
  )
}
