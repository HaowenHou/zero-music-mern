const initialState = {
  playlist: [
    {
      id: 1,
      title: 'Stars In Her Eyes',
      artist: 'Panz',
      track: '/tracks/Stars In Her Eyes - Panz.mp3',
      cover: '/albums/4.png'
    },
    {
      id: 2,
      title: 'Golden Sunshine',
      artist: 'Zack Brown',
      track: '/tracks/Golden Sunshine - Zack Brown.mp3',
      cover: '/albums/5.png'
    },
    {
      id: 3,
      title: 'Stone',
      artist: 'Oliver McCann',
      track: '/tracks/Stone - Oliver McCann.mp3',
      cover: '/albums/6.png'
    },
    {
      id: 4,
      title: 'What Really matters',
      artist: 'Oliver McCann',
      track: '/tracks/What Really matters - Oliver McCann.mp3',
      cover: '/albums/7.png'
    }
  ],
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