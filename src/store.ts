// eslint-disable-next-line import/namespace -- There is something weird going on with the ESLint plugin 'import'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { PREFIX } from './constants.ts'

export interface Weapon {
  id: string
  name: string
  defeats: Array<Weapon['id']>
}
type GameStage = 'ready' | 'countdown' | 'finished'

export interface State {
  weapons: Weapon[]

  stage: GameStage
  wins: number
  draws: number
  losses: number
}
export interface Actions {
  setStage: (newStage: GameStage) => void

  incrementWins: () => void
  incrementDraws: () => void
  incrementLosses: () => void
  resetPlays: () => void
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
const initialValues: State = {
  weapons: defaultWeapons,
  stage: 'ready',
  wins: 0,
  draws: 0,
  losses: 0,
}

type StoreState = State & Actions

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set) => ({
        ...initialValues,
        setStage: (newStage) => {
          set(() => ({ stage: newStage }))
        },
        incrementWins: () => {
          set((state) => ({ wins: state.wins + 1 }))
        },
        incrementDraws: () => {
          set((state) => ({ draws: state.draws + 1 }))
        },
        incrementLosses: () => {
          set((state) => ({ losses: state.losses + 1 }))
        },
        resetPlays: () => {
          set(() => ({ wins: 0, draws: 0, losses: 0 }))
        },
      }),
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
