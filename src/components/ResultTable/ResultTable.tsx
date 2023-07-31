import { getPlayResultText } from '../../utils'

import './ResultTable.css'

import type { PlayerName, Weapon } from '../../store'
import type { PlayResult } from '../../utils'
import type { ReactElement } from 'react'

interface ResultTableProps {
  playerName: PlayerName
  enemyWeapon: Weapon | null
  playerWeapon: Weapon | null
  result: PlayResult | null
}

export function ResultTable({
  playerName,
  enemyWeapon,
  playerWeapon,
  result,
}: ResultTableProps): ReactElement {
  return (
    <section className="result">
      <table>
        <tbody>
          <tr className="enemy">
            <td>Probabilistic Data Processor</td>
            <td>{enemyWeapon?.name}</td>
          </tr>
          <tr className="player">
            <td>{playerName}</td>
            <td>{playerWeapon?.name}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr className="outcome">
            <td>Outcome</td>
            <td>{getPlayResultText(result)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  )
}
