import { useEffect, useCallback, useState, useRef } from 'react'
import { shallow } from 'zustand/shallow'

import { EditorModal } from './components/EditorModal/EditorModal'
import { Leaderboard } from './components/Leaderboard/Leaderboard'
import { Logo } from './components/Logo/Logo'
import { NameModal } from './components/NameModal/NameModal'
import { Score } from './components/Score/Score'
import { WeaponPicker } from './components/WeaponPicker/WeaponPicker'
import { COUNTDOWN_SECONDS, SECOND_IN_MS } from './constants'
import { useStore } from './store'
import { PlayResult, getRandomInt, getPlayResult, GameStage } from './utils'

import './App.css'

import type { Weapon } from './store'
import type { ReactElement, ChangeEventHandler } from 'react'

function App(): ReactElement {
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS)
  const [playerWeapon, setPlayerWeapon] = useState<Weapon | null>(null)
  const [enemyWeapon, setEnemyWeapon] = useState<Weapon | null>(null)
  const [result, setResult] = useState<PlayResult | null>(null)
  const [stage, setStage] = useState<GameStage>(GameStage.Ready)

  const nameInputRef = useRef<HTMLInputElement>(null)

  const [showNameModal, setShowNameModal] = useState<boolean>(false)
  const [forceNameModal, setForceNameModal] = useState<boolean>(true)

  const {
    playerName,
    setPlayer,

    incrementWins,
    incrementLosses,
    incrementDraws,
  } = useStore((state) => ({
    playerName: state.playerName,
    setPlayer: state.setPlayer,

    incrementWins: state.incrementWins,
    incrementLosses: state.incrementLosses,
    incrementDraws: state.incrementDraws,
  }))

  const { weaponsArr } = useStore(
    (state) => ({
      weaponsArr: Object.values(state.weapons),
    }),
    shallow,
  )

  useEffect(() => {
    setShowNameModal(playerName === '')
  }, [playerName])

  const handleNameInput: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      setForceNameModal(event.target.value === '')
    },
    [setForceNameModal],
  )

  const onCloseNameModal = useCallback(() => {
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

    setShowNameModal(true)
    setForceNameModal(true)

    setStage(GameStage.Ready)
    setEnemyWeapon(null)
    setPlayerWeapon(null)
  }, [setStage])

  const startGame = useCallback(() => {
    setStage(GameStage.Countdown)
    setCountdown(COUNTDOWN_SECONDS)
    setEnemyWeapon(null)
    setPlayerWeapon(null)
  }, [setStage])

  useEffect(() => {
    let timeoutId: number = -1

    if (stage === GameStage.Countdown) {
      if (countdown > 0) {
        timeoutId = setTimeout(() => {
          setCountdown((c) => c - 1)
        }, SECOND_IN_MS)
      } else {
        setEnemyWeapon(weaponsArr[getRandomInt(weaponsArr.length)])
        setStage(GameStage.Evaluating)
      }
    }

    return () => {
      if (timeoutId >= 0) {
        clearTimeout(timeoutId)
      }
    }
  }, [countdown, setStage, stage, weaponsArr])

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
  const onCloseEditor = useCallback(() => {
    setShowEditor(false)
  }, [])

  return (
    <>
      <header>
        <Logo />
        <button
          className="edit"
          onClick={() => {
            setShowEditor(true)
          }}
        >
          edit weapons
        </button>
      </header>
      <main>
        <NameModal
          nameInputRef={nameInputRef}
          showNameModal={showNameModal}
          forceNameModal={forceNameModal}
          onCloseNameModal={onCloseNameModal}
          handleNameInput={handleNameInput}
        />
        <EditorModal showEditor={showEditor} onCloseEditor={onCloseEditor} />

        <div>Current player: {playerName}</div>
        {stage === GameStage.Ready && (
          <>
            <button onClick={startGame}>start</button>
          </>
        )}
        {stage === GameStage.Countdown && (
          <>
            <section className="countdown">{countdown}</section>
            <WeaponPicker
              playerWeapon={playerWeapon}
              setPlayerWeapon={setPlayerWeapon}
            />
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
        <Score />
        <Leaderboard />
      </aside>
    </>
  )
}

export default App
