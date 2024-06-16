import { setToken, setUserId, setName, logout, setAvatar, setRole } from '../redux/actionCreators';
import axios from 'axios';

export function logoutUser(dispatch) {
  dispatch(setToken(''));
  dispatch(setUserId(''));
  dispatch(setName(''));
  dispatch(setAvatar(''));
  dispatch(setRole(''));
  dispatch(logout());
  delete axios.defaults.headers.common['Authorization'];
}