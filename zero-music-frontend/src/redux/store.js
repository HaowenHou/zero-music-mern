import { configureStore } from '@reduxjs/toolkit'
import playerStateReducer from './playerStateReducer'
import playlistStateReducer from './playlistStateReducer'
import userStateReducer from './userStateReducer'

export default configureStore({
  reducer: {
    playerState: playerStateReducer,
    playlistState: playlistStateReducer,
    userState: userStateReducer,
  },
})