import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import axios from 'axios';

import playerStateReducer from './playerStateReducer';
import playlistStateReducer from './playlistStateReducer';
import userStateReducer from './userStateReducer';

// Setup the root reducer with persist capabilities
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  playerState: playerStateReducer,
  playlistState: playlistStateReducer,
  userState: userStateReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// Subscription to update the Axios Authorization header
store.subscribe(() => {
  const state = store.getState();
  const token = state.userState.token;

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
});

export default store;
export const persistor = persistStore(store);
