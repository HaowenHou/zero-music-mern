import { setToken, setUserId, setName, logout } from '../redux/actionCreators';
import axios from 'axios';

export function logoutUser(dispatch) {
  dispatch(setToken(''));
  dispatch(setUserId(''));
  dispatch(setName(''));
  dispatch(logout());
  delete axios.defaults.headers.common['Authorization'];
}