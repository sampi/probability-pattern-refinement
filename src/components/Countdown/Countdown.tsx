import { useEffect, useState } from 'react'

import { COUNTDOWN_SECONDS, SECOND_IN_MS } from '../../constants'

import './Countdown.css'

import type { ReactElement } from 'react'

interface CountdownProps {
  onCountdownEnd: () => void
}

export function Countdown({ onCountdownEnd }: CountdownProps): ReactElement {
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS)

  useEffect(() => {
    let timeoutId: number = -1

    if (countdown > 0) {
      timeoutId = setTimeout(() => {
        setCountdown((c) => c - 1)
      }, SECOND_IN_MS)
    } else {
      onCountdownEnd()
    }

    return () => {
      if (timeoutId >= 0) {
        clearTimeout(timeoutId)
      }
    }
  }, [countdown, onCountdownEnd])

  return (
    <>
      <section className="countdown">{countdown}</section>
    </>
  )
}
