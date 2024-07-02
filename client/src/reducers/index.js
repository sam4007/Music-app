import { combineReducers } from 'redux'

import auth from './auth.js'
import uploads from './uploads.js'
import player from './player.js'

export default combineReducers({ auth, uploads, player });