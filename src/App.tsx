import {
  useEffect,
  type ReactElement,
  useCallback,
  useState,
  useRef,
  ChangeEventHandler,
} from 'react'

import { Modal } from './components/Modal/Modal'
import { COUNTDOWN_SECONDS, SECOND_IN_MS } from './constants'
import { GameStage, useStore } from './store'
import { PlayResult, getRandomInt, getPlayResult } from './utils'

import './App.css'

import type { Weapon } from './store'

function App(): ReactElement {
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS)
  const [playerWeapon, setPlayerWeapon] = useState<Weapon | null>(null)
  const [enemyWeapon, setEnemyWeapon] = useState<Weapon | null>(null)
  const [result, setResult] = useState<PlayResult | null>(null)

  const [plays, setPlays] = useState<number>(0)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const [showNameModal, setShowNameModal] = useState<boolean>(false)
  const [lockNameModal, setLockNameModal] = useState<boolean>(true)

  const [stage, setStage] = useStore(({ stage, setStage }) => [stage, setStage])
  const [playerName, setPlayer] = useStore(({ playerName, setPlayer }) => [
    playerName,
    setPlayer,
  ])
  const { weapons, wins, losses, draws } = useStore(
    ({ weapons, wins, losses, draws }) => ({
      weapons,
      wins,
      losses,
      draws,
    }),
  )
  const { incrementWins, incrementLosses, incrementDraws } = useStore(
    ({ incrementWins, incrementLosses, incrementDraws }) => ({
      incrementWins,
      incrementLosses,
      incrementDraws,
    }),
  )

  /**
   * Get derived/computed state
   */
  useEffect(() => {
    setPlays(wins + losses + draws)
  }, [draws, losses, wins])

  useEffect(() => {
    setShowNameModal(playerName === '')
  }, [playerName])

  const handleNameInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setLockNameModal(event.target.value === '')
    },
    [setLockNameModal],
  )

  const closeNameModal = useCallback(() => {
    const newPlayerName = nameInputRef.current?.value ?? ''
    if (newPlayerName === '') {
      return
    }
    setPlayer(newPlayerName)

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
    setLockNameModal(true)

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
    setEnemyWeapon(weapons[getRandomInt(weapons.length)])
    setPlayerWeapon(null)
  }, [setStage, weapons])

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

  return (
    <>
      <header>
        <h1 className="logo">Rock ⊕ Paper ⊕ Scissors</h1>
      </header>
      <main>
        <Modal
          open={showNameModal}
          locked={lockNameModal}
          onClose={closeNameModal}
        >
          <form
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
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
              disabled={lockNameModal}
              onClick={closeNameModal}
            >
              Let’s play!
            </button>
            {/** @TODO handle ESC to cancel the dialog */}
            {/* playerName !== '' && (
              <button
                formMethod="dialog"
                onClick={() => {
                  if (nameInputRef.current != null) {
                    nameInputRef.current.value = playerName
                  }
                  closeNameModal()
                }}
              >
                cancel
              </button>
              ) */}
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
              {weapons.map((weapon) => (
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
