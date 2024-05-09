export const togglePlay = () => ({
  type: 'TOGGLE_PLAY'
});

export const setVolume = (volume) => ({
  type: 'SET_VOLUME',
  payload: volume
});

export const setTrackIndex = (index) => ({
  type: 'SET_TRACK_INDEX',
  payload: index
});

export const setCurrentTime = (time) => ({
  type: 'SET_CURRENT_TIME',
  payload: time
});

export const setPlaylist = (playlist) => ({
  type: 'SET_PLAYLIST',
  payload: playlist
});