import React from "./core/index"

const update = React.update()


let showBar = false
function Counter() {
  const bar = <div>bar</div>
  function handleShowBar() {
    showBar = !showBar
    update()
  }
  return (
    <div>
      counter
      <div>{showBar && bar}</div>
      <button onClick={handleShowBar}>showBar</button>
    </div>
  )
}

function App() {
  return (
    <div>
      mini-react
      <Counter></Counter>
    </div>
  )
}

React.createRoot(document.querySelector('#root'))?.render(<App />)

