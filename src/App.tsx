import { useEffect, type ReactElement, useCallback, useState } from 'react'
import { shallow } from 'zustand/shallow'

import { COUNTDOWN_SECONDS } from './constants'
import { useStore } from './store'
import { getRandomInt } from './utils'

import './App.css'

import type { Weapon } from './store'

type PlayOutcome = 'win' | 'lose' | 'draw'

const getWeaponById = (
  weaponId: Weapon['id'] | null,
  weapons: Weapon[],
): Weapon | undefined => {
  if (weaponId == null) {
    return
  }

  return weapons.find((weapon) => weapon.id === weaponId)
}

function App(): ReactElement {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS)
  const [playerWeaponId, setPlayerWeaponId] = useState<Weapon['id'] | null>(
    null,
  )
  const [enemyWeaponId, setEnemyWeaponId] = useState<Weapon['id'] | null>(null)
  const [playOutcome, setPlayOutcome] = useState<PlayOutcome | null>(null)

  const [plays, setPlays] = useState<number>(0)

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

  // derive number of plays from state
  useEffect(() => {
    setPlays(wins + losses + draws)
  }, [draws, losses, wins])

  const [stage, setStage] = useStore(
    (state) => [state.stage, state.setStage],
    shallow,
  )
  const startGame = useCallback(() => {
    setStage('countdown')
    setEnemyWeaponId(null)
    setPlayerWeaponId(null)
  }, [setStage])

  const decreaseCountdown = useCallback(() => {
    setCountdown((currentCountdown) => currentCountdown - 1)
  }, [setCountdown])

  useEffect(() => {
    if (stage === 'countdown') {
      if (countdown > 0) {
        setTimeout(decreaseCountdown, 1000)
      } else {
        setEnemyWeaponId(weapons[getRandomInt(weapons.length)].id)
        setStage('finished')
      }
    }
  }, [countdown, decreaseCountdown, setStage, stage, weapons])

  useEffect(() => {
    // Check if we just finished a play
    if (stage === 'finished' && countdown === 0) {
      setCountdown(COUNTDOWN_SECONDS)

      let tmpPlayOutcome: PlayOutcome | null = null

      // check who wins, auto-lose player if they didn't choose
      if (playerWeaponId == null) {
        // The player didn't choose a weapon
        tmpPlayOutcome = 'lose'
      } else if (playerWeaponId === enemyWeaponId) {
        tmpPlayOutcome = 'draw'
      } else {
        const playerWeapon = getWeaponById(playerWeaponId, weapons) as Weapon
        if (playerWeapon.defeats.includes(enemyWeaponId as string)) {
          tmpPlayOutcome = 'win'
        } else {
          tmpPlayOutcome = 'lose'
        }
      }

      /**
       * Because I didn't want to duplicate the logic for the 'lose' outcome,
       * it is stored in a temporary variable and then used in this block.
       */
      setPlayOutcome(tmpPlayOutcome)
      switch (tmpPlayOutcome) {
        case 'win':
          incrementWins()
          break
        case 'lose':
          incrementLosses()
          break
        case 'draw':
          incrementDraws()
          break
        default:
          break
      }
    }
  }, [
    countdown,
    enemyWeaponId,
    incrementDraws,
    incrementLosses,
    incrementWins,
    playerWeaponId,
    setStage,
    stage,
    weapons,
  ])

  const playAgain = useCallback(() => {
    setStage('countdown')
  }, [setStage])

  const chooseWeapon = useCallback(
    (weaponId: Weapon['id']) => {
      setPlayerWeaponId(weaponId)
    },
    [setPlayerWeaponId],
  )

  return (
    <>
      <header>
        <h1 className="logo">Rock ⊕ Paper ⊕ Scissors</h1>
      </header>
      <main>
        {stage === 'ready' && <button onClick={startGame}>start</button>}
        {stage === 'countdown' && (
          <>
            <section className="countdown">{countdown}</section>
            <ul className="weapons">
              {weapons.map((weapon) => (
                <li
                  key={weapon.id}
                  className={[
                    'weapon',
                    weapon.id === playerWeaponId && 'active',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <button
                    onClick={() => {
                      chooseWeapon(weapon.id)
                    }}
                  >
                    {weapon.name}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {stage === 'finished' && (
          <>
            <article className="enemyWeapon">
              enemy: {getWeaponById(enemyWeaponId, weapons)?.name}
            </article>
            <article className="playerWeapon">
              player: {getWeaponById(playerWeaponId, weapons)?.name}
            </article>
            <div>
              {playOutcome === 'win'
                ? getWeaponById(playerWeaponId, weapons)?.name
                : getWeaponById(enemyWeaponId, weapons)?.name}{' '}
              beats{' '}
              {playOutcome === 'win'
                ? getWeaponById(enemyWeaponId, weapons)?.name
                : getWeaponById(playerWeaponId, weapons)?.name}
            </div>
            <div>player {playOutcome}</div>
            <button onClick={playAgain}>play again</button>
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
