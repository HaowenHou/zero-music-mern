import { configureStore } from '@reduxjs/toolkit'
import playerStateReducer from './playerStateReducer'
import playlistStateReducer from './playlistStateReducer'

export default configureStore({
  reducer: {
    playerState: playerStateReducer,
    playlistState: playlistStateReducer,
  },
})