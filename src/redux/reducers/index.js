import { combineReducers } from 'redux'

import app from './app'

function defaultReducer(state = {}, action) {
  return state;
}

export default combineReducers({
  app
});