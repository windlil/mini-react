import './App'
import React from './core'

const App = <div id="1">
  <h1>h1</h1>
  <h2>h2</h2>
  <ul>
    <li>1</li>
    <li>2</li>
  </ul>
  <div>
    <div>
      <div>
        <div>1</div>
        <div>
          <div>2</div>
        </div>
      </div>
    </div>
  </div>
</div>


React.createRoot(document.getElementById('root'))?.render(App)