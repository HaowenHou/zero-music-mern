const initialState = {
  isPlaying: false,
  volume: 1, // Default volume (0.0 - 1.0)
  currentTrackIndex: 0,
  currentTime: 0, // Current playback time in seconds
  currentTrackId: '',
};

const playerStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_PLAY':
      return {
        ...state,
        isPlaying: !state.isPlaying
      };
    case 'SET_PLAY':
      return {
        ...state,
        isPlaying: action.payload
      };
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload
      };
    case 'SET_TRACK_INDEX':
      return {
        ...state,
        currentTrackIndex: action.payload
      };
    case 'SET_CURRENT_TIME':
      return {
        ...state,
        currentTime: action.payload
      };
    case 'SET_CURRENT_TRACK_ID':
      return {
        ...state,
        currentTrackId: action.payload
      };
    default:
      return state;
  }
};

export default playerStateReducer;
