import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

import playerStateReducer from './playerStateReducer';
import playlistStateReducer from './playlistStateReducer';
import userStateReducer from './userStateReducer';

// Setup the root reducer with persist capabilities
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userState'] // You can choose to persist only certain slices of the state
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

export default store;

export const persistor = persistStore(store);
