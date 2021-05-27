import React from 'react'

import { BrowserRouter as Router } from 'react-router-dom'
import MainView from './views/MainView'

const App = () => {
  return (
    <Router>
      <MainView />
    </Router>
  )
}

export default App