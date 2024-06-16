const initialState = {
  playlist: [],
};

const playlistStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: action.payload
      };
    default:
      return state;
  }
};

export default playlistStateReducer;