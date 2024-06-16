export const togglePlay = () => ({
  type: 'TOGGLE_PLAY'
});

export const setPlay = (isPlaying) => ({
  type: 'SET_PLAY',
  payload: isPlaying
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

export const setCurrentTrackId = (trackId) => ({
  type: 'SET_CURRENT_TRACK_ID',
  payload: trackId
});

export const setPlaylist = (playlist) => ({
  type: 'SET_PLAYLIST',
  payload: playlist
});

export const setToken = (token) => ({
  type: 'SET_TOKEN',
  payload: token
});

export const setUserId = (userId) => ({
  type: 'SET_USER_ID',
  payload: userId
});

export const setName = (name) => ({
  type: 'SET_NAME',
  payload: name
});

export const setAvatar = (avatar) => ({
  type: 'SET_AVATAR',
  payload: avatar
});

export const setRole = (role) => ({
  type: 'SET_ROLE',
  payload: role
});

export const login = () => ({
  type: 'LOGIN'
});

export const logout = () => ({
  type: 'LOGOUT'
});