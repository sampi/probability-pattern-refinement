import { useStore } from '../../store'
import { PlayResult, getPlayResultText } from '../../utils'

import './Score.css'

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
      <h2>Enumerative Assemblage</h2>
      <article>
        <h3>{getPlayResultText(PlayResult.Win)}</h3>
        <span>{wins}</span>
      </article>
      <article>
        <h3>{getPlayResultText(PlayResult.Draw)}</h3>
        <span>{draws}</span>
      </article>
      <article>
        <h3>{getPlayResultText(PlayResult.Lose)}</h3>
        <span>{losses}</span>
      </article>
      <article>
        <h3>Patterns</h3>
        <span>{plays}</span>
      </article>
    </section>
  )
}
