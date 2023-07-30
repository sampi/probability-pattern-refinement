import { useEffect, type ReactElement, useCallback, useState } from 'react'

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

  const [stage, setStage] = useStore(({ stage, setStage }) => [stage, setStage])
  const { weapons, wins, losses, draws } = useStore(
    ({ weapons, wins, losses, draws }) => ({
      weapons,
      wins,
      losses,
      draws,
    }),
  )
  const { incrementWins, incrementLosses, incrementDraws, resetPlays } =
    useStore(
      ({ incrementWins, incrementLosses, incrementDraws, resetPlays }) => ({
        incrementWins,
        incrementLosses,
        incrementDraws,
        resetPlays,
      }),
    )

  /**
   * Get derived/computed state
   */
  useEffect(() => {
    setPlays(wins + losses + draws)
  }, [draws, losses, wins])

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
        {stage === GameStage.Ready && (
          <button onClick={startGame}>start</button>
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
              enemy: {enemyWeapon?.name}
            </article>
            <article className="playerWeapon">
              player: {playerWeapon?.name}
            </article>
            {/* @TODO explain why (e.g. rock defeats scissors) */}
            <div>player {result}</div>
            <button onClick={startGame}>play again</button>
          </>
        )}
        <button onClick={resetPlays}>reset</button>
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
