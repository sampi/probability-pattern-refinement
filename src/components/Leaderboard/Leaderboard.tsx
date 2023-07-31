import { shallow } from 'zustand/shallow'

import { useStore } from '../../store'
import { getPlayResultText, PlayResult } from '../../utils'

import './Leaderboard.css'

import type { ReactElement } from 'react'

export function Leaderboard(): ReactElement {
  const { leaderboard } = useStore(
    ({ leaderboard }) => ({
      leaderboard,
    }),
    shallow,
  )

  return (
    <section className="leaderboard">
      <h2>Quarterly Ranking</h2>
      <ul>
        {/* @TODO empty state */}
        {Object.entries(leaderboard)
          .sort(([aName, aScore], [bName, bScore]) => {
            /** Return the player with most scores first */
            if (bScore.wins !== aScore.wins) {
              return bScore.wins - aScore.wins
            }

            /** If there is a tie, return the player with the least losses */
            if (aScore.losses !== bScore.losses) {
              return aScore.losses - bScore.losses
            }

            /** If there is a tie, return the player with the least draws */
            if (aScore.draws !== bScore.draws) {
              return aScore.draws - bScore.draws
            }

            /** If there is a tie, return sorted alphabetically */
            return aName.localeCompare(bName)
          })
          .map(([name, score]) => (
            <li key={name}>
              <h3>{name}</h3>
              <article>
                <h4>{getPlayResultText(PlayResult.Win)}</h4>
                <p>{score.wins}</p>
              </article>
              <article>
                <h4>{getPlayResultText(PlayResult.Draw)}</h4>
                <p>{score.draws}</p>
              </article>
              <article>
                <h4>{getPlayResultText(PlayResult.Lose)}</h4>
                <p>{score.losses}</p>
              </article>
            </li>
          ))}
      </ul>
    </section>
  )
}
