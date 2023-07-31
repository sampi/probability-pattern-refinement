import { useEffect, useCallback, useState, useRef } from 'react'
import { shallow } from 'zustand/shallow'

import { Countdown } from './components/Countdown/Countdown'
import { EditorModal } from './components/EditorModal/EditorModal'
import { Header } from './components/Header/Header'
import { Leaderboard } from './components/Leaderboard/Leaderboard'
import { NameModal } from './components/NameModal/NameModal'
import { ResultTable } from './components/ResultTable/ResultTable'
import { Score } from './components/Score/Score'
import { WeaponPicker } from './components/WeaponPicker/WeaponPicker'
import { useStore } from './store'
import { PlayResult, getRandomInt, getPlayResult, GameStage } from './utils'

import './App.css'

import type { Weapon } from './store'
import type { ReactElement, ChangeEventHandler } from 'react'

function App(): ReactElement {
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

  const onCountdownEnd = useCallback(() => {
    setEnemyWeapon(weaponsArr[getRandomInt(weaponsArr.length)])
    setStage(GameStage.Evaluating)
  }, [weaponsArr])

  const [showEditor, setShowEditor] = useState<boolean>(false)
  const onCloseEditor = useCallback(() => {
    setShowEditor(false)
  }, [])

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
    setEnemyWeapon(null)
    setPlayerWeapon(null)
  }, [setStage])

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
    <div className="layout">
      <Header
        setShowEditor={setShowEditor}
        disableEditor={stage === GameStage.Countdown}
      />

      <main>
        {stage === GameStage.Ready && (
          <>
            <div className="content">
              <button className="large" onClick={startGame}>
                Initiate Analysis
              </button>
            </div>
          </>
        )}
        {stage === GameStage.Countdown && (
          <>
            <div className="content">
              <Countdown onCountdownEnd={onCountdownEnd} />
            </div>
            <footer>
              <WeaponPicker
                playerWeapon={playerWeapon}
                setPlayerWeapon={setPlayerWeapon}
              />
            </footer>
          </>
        )}
        {stage === GameStage.Done && (
          <>
            <div className="content">
              <ResultTable
                playerName={playerName}
                enemyWeapon={enemyWeapon}
                playerWeapon={playerWeapon}
                result={result}
              />
            </div>
            <footer>
              <menu>
                <li>
                  <button className="large" onClick={startGame}>
                    Rerun Analysis
                  </button>
                </li>
              </menu>
            </footer>
          </>
        )}
        {stage !== GameStage.Countdown && (
          <footer>
            <menu className="player">
              <li>
                <p>Current Employee: {playerName}</p>
              </li>
              <li>
                <button onClick={resetGame}>Log Off</button>
              </li>
            </menu>
          </footer>
        )}
      </main>

      <aside className="score">
        <Score />
        <Leaderboard />
      </aside>

      <NameModal
        nameInputRef={nameInputRef}
        showNameModal={showNameModal}
        forceNameModal={forceNameModal}
        onCloseNameModal={onCloseNameModal}
        handleNameInput={handleNameInput}
      />
      <EditorModal showEditor={showEditor} onCloseEditor={onCloseEditor} />
    </div>
  )
}

export default App
