import { useCallback, useRef, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { COLORS, NUM_MAX_WEAPONS, NUM_MIN_WEAPONS } from '../../constants'
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
            <div>Data Processor</div>
            <div>Employee</div>
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
              <div className="control">
                <p>{playerWeapon.name}</p>
                <button
                  onClick={() => {
                    deleteWeapon(playerWeapon.id)
                  }}
                  disabled={weaponsArr.length < 4}
                >
                  Discard
                </button>
              </div>
            </th>
            {weaponsArr.map((enemyWeapon) => {
              const key = `${enemyWeapon.id}-${playerWeapon.id}`
              const result = getPlayResult(playerWeapon, enemyWeapon)
              let text: string
              switch (result) {
                case PlayResult.Win:
                  text = '+'
                  break
                case PlayResult.Draw:
                  text = 'O'
                  break
                case PlayResult.Lose:
                default:
                  text = '-'
                  break
              }
              if (result === PlayResult.Draw) {
                return (
                  <td key={key}>
                    <p>{text}</p>
                  </td>
                )
              }
              return (
                <td key={key}>
                  <button
                    className={[
                      result === PlayResult.Win && 'win',
                      result === PlayResult.Lose && 'lose',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      toggleWeaponDefeat(playerWeapon, enemyWeapon)
                    }}
                  >
                    {text}
                  </button>
                </td>
              )
            })}
          </tr>
        ))}
        {weaponsArr.length >= NUM_MIN_WEAPONS &&
          weaponsArr.length < NUM_MAX_WEAPONS && (
            <tr>
              <th className="new-weapon">
                <form
                  onSubmit={(event) => {
                    event.preventDefault()
                  }}
                >
                  <label htmlFor="weaponName">Append Apparatus</label>
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
                    Append
                  </button>
                </form>
              </th>
            </tr>
          )}
      </tbody>
    </table>
  )
}
