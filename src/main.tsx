import React, { update } from './core'

let count = 1
const Counter = () => {
  const handleClick = () => {
    count++
    console.log(count)
    update()
  }

  return (
    <div>
      count: {count}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

const App = () => {
  return (
    <div>
      <h1>h1</h1>
      <ul>
        <li>1</li>
        <li>2</li>
      </ul>
      <Counter/>
    </div>
  )
}


React.createRoot(document.getElementById('root'))?.render(<App />)