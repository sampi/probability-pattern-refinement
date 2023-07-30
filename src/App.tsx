import './App.css'

import { useEffect, type ReactElement } from 'react'
import { useStore } from './store'

function App(): ReactElement {
  const weapons = useStore((state) => state.weapons)
  const incrementWins = useStore((state) => state.incrementWins)
  const resetPlays = useStore((state) => state.resetPlays)

  const setStage = useStore((state) => state.setStage)

  useEffect(() => {
    setStage('ready')
  }, [])

  return (
    <>
      <header>
        <h1 className="logo">Rock ⊕ Paper ⊕ Scissors</h1>
      </header>
      <main>
        <ul className="weapons">
          {weapons.map((weapon) => (
            <li key={weapon.id}>
              <button className="attack weapon" onClick={incrementWins}>
                {weapon.name}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={resetPlays}>reset</button>
      </main>
      <aside className="score"></aside>
    </>
  )
}

export default App
