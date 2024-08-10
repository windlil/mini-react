import React from './core'


const Counter = ({count}: any) => {
  return (
    <div>
      count: {count}
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
      <Counter count={10} />
      <Counter count={20} />
    </div>
  )
}


React.createRoot(document.getElementById('root'))?.render(<App />)