import {
  useEffect,
  useCallback,
  useState,
  useRef,
  useLayoutEffect,
} from 'react'

import { Modal } from './components/Modal/Modal'
import { WeaponsMap } from './components/WeaponsMap/WeaponsMap'
import { COLORS, COUNTDOWN_SECONDS, SECOND_IN_MS } from './constants'
import { GameStage, useStore } from './store'
import { PlayResult, getRandomInt, getPlayResult, getGameTitle } from './utils'

import './App.css'

import type { Weapon } from './store'
import type { ReactElement, ChangeEventHandler, MouseEventHandler } from 'react'

function App(): ReactElement {
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS)
  const [playerWeapon, setPlayerWeapon] = useState<Weapon | null>(null)
  const [enemyWeapon, setEnemyWeapon] = useState<Weapon | null>(null)
  const [result, setResult] = useState<PlayResult | null>(null)

  const weaponInputRef = useRef<HTMLInputElement>(null)
  const [newWeaponName, setNewWeaponName] = useState<string>('')

  const nameInputRef = useRef<HTMLInputElement>(null)
  const [showNameModal, setShowNameModal] = useState<boolean>(false)
  const [forceNameModal, setForceNameModal] = useState<boolean>(true)

  const [stage, setStage] = useStore(({ stage, setStage }) => [stage, setStage])
  const [playerName, setPlayer] = useStore(({ playerName, setPlayer }) => [
    playerName,
    setPlayer,
  ])
  const { toggleWeaponDefeat, deleteWeapon, createWeapon } = useStore(
    ({ toggleWeaponDefeat, deleteWeapon, createWeapon }) => ({
      toggleWeaponDefeat,
      deleteWeapon,
      createWeapon,
    }),
  )
  const { weaponsArr, wins, losses, draws, plays } = useStore(
    ({ weapons, wins, losses, draws }) => ({
      weaponsArr: Object.values(weapons),
      wins,
      losses,
      draws,
      plays: wins + losses + draws,
    }),
  )
  const { incrementWins, incrementLosses, incrementDraws } = useStore(
    ({ incrementWins, incrementLosses, incrementDraws }) => ({
      incrementWins,
      incrementLosses,
      incrementDraws,
    }),
  )

  useLayoutEffect(() => {
    document.title = getGameTitle(weaponsArr)
  }, [weaponsArr])

  useEffect(() => {
    setShowNameModal(playerName === '')
  }, [playerName])

  const handleNameInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setForceNameModal(event.target.value === '')
    },
    [setForceNameModal],
  )

  const closeNameModal = useCallback(() => {
    const newPlayerName = nameInputRef.current?.value ?? ''
    if (newPlayerName !== '') {
      setPlayer(newPlayerName)
    }

    setShowNameModal(false)

    setStage(GameStage.Ready)
    setEnemyWeapon(null)
    setPlayerWeapon(null)
  }, [setPlayer, setStage])

  const resetGame = useCallback(() => {
    if (nameInputRef?.current != null) {
      nameInputRef.current.value = ''
    }

    // setPlayer('')

    setShowNameModal(true)
    setForceNameModal(true)

    setStage(GameStage.Ready)
    setEnemyWeapon(null)
    setPlayerWeapon(null)
  }, [setStage])

  const startGame = useCallback(() => {
    setStage(GameStage.Countdown)
    setCountdown(COUNTDOWN_SECONDS)
    /**
     * Ideally, I wanted to set `enemyWeapon` at the last moment of the countdown
     * but `setStage()` fires faster via zustand than setEnemyWeapon via setState.
     */
    setEnemyWeapon(weaponsArr[getRandomInt(weaponsArr.length)])
    setPlayerWeapon(null)
  }, [setStage, weaponsArr])

  useEffect(() => {
    let timeoutId: number | undefined

    if (stage === GameStage.Countdown) {
      if (countdown > 0) {
        timeoutId = setTimeout(() => {
          setCountdown((c) => c - 1)
        }, SECOND_IN_MS)
      } else {
        setStage(GameStage.Evaluating)
      }
    }

    return () => {
      if (timeoutId != null && timeoutId !== 0) {
        clearTimeout(timeoutId)
      }
    }
  }, [countdown, setStage, stage])

  useEffect(() => {
    if (stage === GameStage.Evaluating) {
      setStage(GameStage.Done)

      const result: PlayResult = getPlayResult(playerWeapon, enemyWeapon)
      setResult(result)

      switch (result) {
        case PlayResult.Draw:
          incrementDraws()
          break
        case PlayResult.Win:
          incrementWins()
          break
        case PlayResult.Lose:
          incrementLosses()
          break
        default:
          break
      }
    }
  }, [
    enemyWeapon,
    incrementDraws,
    incrementLosses,
    incrementWins,
    playerWeapon,
    setStage,
    stage,
  ])

  const [showEditor, setShowEditor] = useState<boolean>(false)
  const closeEditor = useCallback(() => {
    setShowEditor(false)
  }, [])

  const removeWeapon = useCallback(
    (weaponId: string) => {
      deleteWeapon(weaponId)
    },
    [deleteWeapon],
  )

  const handleWeaponInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setNewWeaponName(event.target.value)
    },
    [],
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

  return (
    <>
      <header>
        <h1 className="logo">{getGameTitle(weaponsArr)}</h1>
        <button
          className="edit"
          onClick={() => {
            setShowEditor(true)
          }}
        >
          edit
        </button>
      </header>
      <main>
        <Modal
          className="fullscreen"
          open={showEditor}
          locked={false}
          onClose={closeEditor}
        >
          {showEditor && (
            <>
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
                            removeWeapon(playerWeapon.id)
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
                              getPlayResult(playerWeapon, enemyWeapon) ===
                              PlayResult.Draw
                            }
                            onClick={() => {
                              toggleWeaponDefeat(playerWeapon, enemyWeapon)
                            }}
                          >
                            {getPlayResult(
                              playerWeapon,
                              enemyWeapon,
                            ).toString()}
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
                          <button
                            onClick={addWeapon}
                            disabled={newWeaponName === ''}
                          >
                            +
                          </button>
                        </form>
                      </th>
                    </tr>
                  )}
                </tbody>
              </table>
              <WeaponsMap />
            </>
          )}
        </Modal>
        <Modal
          open={showNameModal}
          locked={playerName === ''}
          onClose={closeNameModal}
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
              onClick={closeNameModal}
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
                  closeNameModal()
                }}
              >
                cancel
              </button>
            )}
          </form>
        </Modal>
        <div>Current player: {playerName}</div>
        {stage === GameStage.Ready && (
          <>
            <button onClick={startGame}>start</button>
          </>
        )}
        {stage === GameStage.Countdown && (
          <>
            <section className="countdown">{countdown}</section>
            <ul className="weapons">
              {weaponsArr.map((weapon) => (
                <li
                  key={weapon.id}
                  className={[
                    'weapon',
                    weapon.id === playerWeapon?.id && 'active',
                  ]
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
          </>
        )}
        {stage === GameStage.Done && (
          <>
            <article className="enemyWeapon">
              computer: {enemyWeapon?.name}
            </article>
            <article className="playerWeapon">
              {playerName}: {playerWeapon?.name}
            </article>
            {/* @TODO explain why (e.g. rock defeats scissors) */}
            <div>
              {playerName} {result}
            </div>
            <button onClick={startGame}>play again</button>
          </>
        )}
        <button onClick={resetGame}>new player</button>
      </main>
      <aside className="score">
        <article>
          <h4>Losses</h4>
          <span>{losses}</span>
        </article>
        <article>
          <h4>Draws</h4>
          <span>{draws}</span>
        </article>
        <article>
          <h4>Wins</h4>
          <span>{wins}</span>
        </article>
        <article>
          <h4>Plays</h4>
          <span>{plays}</span>
        </article>
      </aside>
    </>
  )
}

export default App
