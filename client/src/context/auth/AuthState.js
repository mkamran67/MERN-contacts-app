import React, { useReducer, useContext } from 'react';
import AuthContext from './AuthContext';
import AuthReducer from './AuthReducer';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
    loading: true,
    error: null
  };

  const authContext = useContext(AuthContext);
  // reducer
  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // Load User, check which user is logged in
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  };

  // Register User, sign the user up and get a token back
  const register = async formData => {
    // config is for axios headers being passed to the server
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      // with axios Post(URL, DATA, HEADERS CONFIG)
      const res = await axios.post('/api/users', formData, config);

      // type, payload
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
  };
  // Login User, log the user in and get the token
  const loginUser = async formData => {
    // config is for axios headers being passed to the server
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      // with axios Post(URL, DATA, HEADERS CONFIG)
      const res = await axios.post('/api/auth', formData, config);

      // type, payload
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg
      });
    }
  };
  // Log out, remove data and destroy the token
  const logoutUser = () => dispatch({ type: LOGOUT });
  // Clear Errors
  const clearErrors = () =>
    dispatch({
      type: CLEAR_ERRORS
    });

  // Return our provider
  return (
    // value is what's accessible
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        register,
        clearErrors,
        loadUser,
        loginUser,
        logoutUser
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
