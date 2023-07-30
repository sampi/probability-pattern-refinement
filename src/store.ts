// eslint-disable-next-line import/namespace -- There is something weird going on with the ESLint plugin 'import'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { PREFIX } from './constants.ts'

export interface Weapon {
  id: string
  name: string
  defeats: Array<Weapon['id']>
}
export enum GameStage {
  Ready,
  Countdown,
  Evaluating,
  Done,
}

type PlayerName = string

interface Score {
  wins: number
  draws: number
  losses: number
}

type Leaderboard = Record<PlayerName, Score>

export interface State extends Score {
  weapons: Weapon[]

  playerName: PlayerName

  stage: GameStage

  leaderboard: Leaderboard
}
export interface Actions {
  setStage: (newStage: GameStage) => void

  setPlayer: (newPlayerName: PlayerName) => void

  incrementWins: () => void
  incrementDraws: () => void
  incrementLosses: () => void
}

const defaultWeapons: Weapon[] = (() => {
  const ids: string[] = [nanoid(), nanoid(), nanoid()]
  return [
    {
      id: ids[0],
      name: 'Rock',
      defeats: [ids[2]],
    },
    {
      id: ids[1],
      name: 'Paper',
      defeats: [ids[0]],
    },
    {
      id: ids[2],
      name: 'Scissors',
      defeats: [ids[1]],
    },
  ]
})()
const initialScore: Score = {
  wins: 0,
  draws: 0,
  losses: 0,
}
const initialValues: State = {
  weapons: defaultWeapons,
  stage: GameStage.Ready,
  playerName: '',
  leaderboard: {},
  ...initialScore,
}

type StoreState = State & Actions

function incrementScore(type: keyof Score, state: State): void {
  /**
   * I can't destructure `leaderboard` because the Proxy object breaks
   */
  const { playerName } = state

  if (playerName !== '') {
    if (state.leaderboard[playerName] == null) {
      state.leaderboard[playerName] = initialScore
    }
    state.leaderboard[playerName][type]++
  }

  state[type]++
}

export const useStore = create(
  devtools(
    persist(
      immer<StoreState>((set) => ({
        ...initialValues,

        setStage: (newStage) => {
          set((state) => {
            state.stage = newStage
          })
        },

        setPlayer: (newPlayerName) => {
          set((state) => {
            state.playerName = newPlayerName

            const { wins, draws, losses } =
              state.leaderboard[newPlayerName] ?? initialScore

            state.wins = wins
            state.draws = draws
            state.losses = losses
          })
        },

        incrementWins: () => {
          set((state) => {
            incrementScore('wins', state)
          })
        },
        incrementDraws: () => {
          set((state) => {
            incrementScore('draws', state)
          })
        },
        incrementLosses: () => {
          set((state) => {
            incrementScore('losses', state)
          })
        },
      })),
      {
        name: PREFIX,
        partialize: (state) =>
          Object.fromEntries(
            // Don't persist 'stage' in localStorage
            Object.entries(state).filter(([key]) => !['stage'].includes(key)),
          ),
      },
    ),
  ),
)
