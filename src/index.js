import ReactDOM from 'react-dom'
import React from 'react'

import App from './App'
import { Provider } from 'react-redux';
import store from './redux/store'

const root = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, 
  root);