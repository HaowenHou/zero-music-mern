import { configureStore } from '@reduxjs/toolkit'
import playerStateReducer from './playerStateReducer'

export default configureStore({
  reducer: {
    playerState: playerStateReducer,
  },
})