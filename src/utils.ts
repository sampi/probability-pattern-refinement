import type { Weapon } from './store'

/**
 * Get a random integer
 *
 * @see https://github.com/chancejs/chancejs/issues/232#issuecomment-182500222
 */
export function getRandomInt(max: number = 1): number {
  const arr = new Uint32Array(1)
  window.crypto.getRandomValues(arr)
  // convert to float between 0...1, and then an int between 0...max
  return Math.floor((arr[0] / (0xffffffff + 1)) * max)
}

export const enum PlayResult {
  Win = 'win',
  Lose = 'lose',
  Draw = 'draw',
}
export function getPlayResult(
  playerWeapon: Weapon | null,
  enemyWeapon: Weapon | null,
): PlayResult {
  if (playerWeapon == null) {
    return PlayResult.Lose
  } else if (enemyWeapon == null) {
    /**
     * This case never happens, but it helps to avoid null-checks in the code further down
     */
    return PlayResult.Win
  }

  if (playerWeapon.id === enemyWeapon.id) {
    return PlayResult.Draw
  }

  if (playerWeapon.defeats.includes(enemyWeapon.id)) {
    return PlayResult.Win
  }
  return PlayResult.Lose
}

export function getGameTitle(weapons: Weapon[]): string {
  return weapons.map(({ name }) => name).join(' ⊕ ')
}

export enum GameStage {
  Ready,
  Countdown,
  Evaluating,
  Done,
}
