import { useEffect, type ReactElement, useCallback, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { COUNTDOWN_SECONDS, SECOND_IN_MS } from './constants'
import { GameStage, useStore } from './store'
import { getRandomInt } from './utils'

import './App.css'

import type { Weapon } from './store'

const enum PlayResult {
  Win,
  Lose,
  Draw,
}
// type PlayResult = 'win' | 'lose' | 'draw'

const getExplainer = (winner: string, loser: string): string => {
  return `${winner} beats ${loser}`
}

function App(): ReactElement {
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS)
  const [playerWeapon, setPlayerWeapon] = useState<Weapon | null>(null)
  const [enemyWeapon, setEnemyWeapon] = useState<Weapon | null>(null)
  const [result, setResult] = useState<PlayResult | null>(null)
  const [explainer, setExplainer] = useState<string | null>(null)

  const [plays, setPlays] = useState<number>(0)

  const [stage, setStage] = useStore(
    ({ stage, setStage }) => [stage, setStage],
    shallow,
  )
  const { weapons, wins, losses, draws } = useStore(
    ({ weapons, wins, losses, draws }) => ({
      weapons,
      wins,
      losses,
      draws,
    }),
    shallow,
  )
  const { incrementWins, incrementLosses, incrementDraws, resetPlays } =
    useStore(
      ({ incrementWins, incrementLosses, incrementDraws, resetPlays }) => ({
        incrementWins,
        incrementLosses,
        incrementDraws,
        resetPlays,
      }),
      shallow,
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
     * Ideally, I wanted to set `enemyWeapon` at the last moment,
     * but `setStage()` fires faster via zustand than setEnemyWeapon via setState.
     *
     * I decided to set it when the round begins, if the player is a hacker,
     * then they could use this to their advantage >;)
     */
    setEnemyWeapon(weapons[getRandomInt(weapons.length)])
    setPlayerWeapon(null)
    setExplainer(null)
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

      if (playerWeapon?.id === enemyWeapon?.id) {
        setResult(PlayResult.Draw)
        incrementDraws()
      } else if (
        /**
         * The logic here is written in a strange way, so we can combine the following checks:
         * - player didn't select a weapon
         * - player doesn't defeat the enemy
         *
         * This way there is only a single path dealing with the losing condition.
         */
        playerWeapon == null ||
        !playerWeapon?.defeats?.includes(enemyWeapon?.id ?? '')
      ) {
        setResult(PlayResult.Lose)
        incrementLosses()
        if (playerWeapon != null && enemyWeapon != null) {
          setExplainer(getExplainer(enemyWeapon.name, playerWeapon.name))
        }
      } else {
        setResult(PlayResult.Win)
        incrementWins()
        if (playerWeapon != null && enemyWeapon != null) {
          setExplainer(getExplainer(playerWeapon.name, enemyWeapon.name))
        }
      }
    }
  }, [
    countdown,
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
            <div>{explainer}</div>
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
