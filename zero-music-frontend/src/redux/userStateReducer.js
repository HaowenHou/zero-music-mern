const initialState = {
  userId: '',
  name: '',
  token: '',
  isLoggedIn: false,
  avatar: '',
  role: '',
};

const userStateReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER_ID':
      return {
        ...state,
        userId: action.payload
      };
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload
      };
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload
      };
    case 'SET_AVATAR':
      return {
        ...state,
        avatar: action.payload
      };
    case 'SET_ROLE':
      return {
        ...state,
        role: action.payload
      };
    case 'LOGIN':
      return {
        ...state,
        isLoggedIn: true
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false
      };
    default:
      return state;
  }
};

export default userStateReducer;
