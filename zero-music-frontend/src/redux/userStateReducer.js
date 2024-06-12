const initialState = {
  userId: '66208187e28b6b18bafdb287',
  name: '炼金术士',
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
    default:
      return state;
  }
};

export default userStateReducer;
