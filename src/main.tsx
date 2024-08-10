import './App'
import React from './core'

function Child() {
  return (
    <div>Child</div>
  )
}

const App = <div>
  <div>123</div>
  <div>
    123
  </div>
  <ul>
    <li>123</li>
    <li>12</li>
  </ul>
  <h1>1</h1>
  <Child />
</div>


React.createRoot(document.getElementById('root'))?.render(App)