/**
 * Get a random integer
 *
 * @see https://github.com/chancejs/chancejs/issues/232#issuecomment-182500222
 */
export const getRandomInt = (max: number = 1): number => {
  const arr = new Uint32Array(1)
  window.crypto.getRandomValues(arr)
  // convert to
  return Math.floor((arr[0] / (0xffffffff + 1)) * max)
}
