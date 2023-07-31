import { useStore } from '../../store'

import type { ReactElement } from 'react'

export function Score(): ReactElement {
  const { wins, losses, draws, plays } = useStore(
    ({ wins, losses, draws }) => ({
      wins,
      losses,
      draws,
      plays: wins + losses + draws,
    }),
  )

  return (
    <section className="currentPlayer">
      <h2>Score</h2>
      <article>
        <h3>Losses</h3>
        <span>{losses}</span>
      </article>
      <article>
        <h3>Draws</h3>
        <span>{draws}</span>
      </article>
      <article>
        <h3>Wins</h3>
        <span>{wins}</span>
      </article>
      <article>
        <h3>Plays</h3>
        <span>{plays}</span>
      </article>
    </section>
  )
}
