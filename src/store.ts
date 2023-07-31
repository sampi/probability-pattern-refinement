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
export type Weapons = Record<Weapon['id'], Weapon>
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
  weapons: Weapons

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

  toggleWeaponDefeat: (playerWeapon: Weapon, enemyWeapon: Weapon) => void
  createWeapon: (weaponName: Weapon['name']) => void
  deleteWeapon: (weaponId: Weapon['id']) => void
}

const defaultWeapons: Record<Weapon['id'], Weapon> = (() => {
  const ids: string[] = [nanoid(), nanoid(), nanoid()]
  return {
    [ids[0]]: {
      id: ids[0],
      name: 'rock',
      defeats: [ids[2]],
    },
    [ids[1]]: {
      id: ids[1],
      name: 'paper',
      defeats: [ids[0]],
    },
    [ids[2]]: {
      id: ids[2],
      name: 'scissors',
      defeats: [ids[1]],
    },
  }
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

        toggleWeaponDefeat: (playerWeapon, enemyWeapon) => {
          set((state) => {
            if (
              state.weapons[playerWeapon.id].defeats.includes(enemyWeapon.id)
            ) {
              state.weapons[playerWeapon.id].defeats = state.weapons[
                playerWeapon.id
              ].defeats.filter((defeatedId) => defeatedId !== enemyWeapon.id)

              state.weapons[enemyWeapon.id].defeats = Array.from(
                new Set([
                  ...state.weapons[enemyWeapon.id].defeats,
                  playerWeapon.id,
                ]),
              )
            } else {
              state.weapons[enemyWeapon.id].defeats = state.weapons[
                enemyWeapon.id
              ].defeats.filter((defeatedId) => defeatedId !== playerWeapon.id)

              state.weapons[playerWeapon.id].defeats = Array.from(
                new Set([
                  ...state.weapons[playerWeapon.id].defeats,
                  enemyWeapon.id,
                ]),
              )
            }
          })
        },
        createWeapon: (weaponName) => {
          set((state) => {
            const weaponId = nanoid()

            state.weapons[weaponId] = {
              id: weaponId,
              name: weaponName,
              defeats: Object.keys(state.weapons),
            }
          })
        },
        deleteWeapon: (weaponId) => {
          set((state) => {
            if (state.weapons[weaponId] != null) {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- this is safe to delete, I might consider refactoring to Map() in the future
              delete state.weapons[weaponId]
            }
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
