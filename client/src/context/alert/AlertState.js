import React, { useReducer, useContext } from 'react';
import uuid from 'uuid';
import AlertContext from './alertContext';
import alertReducer from './alertReducer';
import { SET_ALERT, REMOVE_ALERT } from '../types';

const AlertState = props => {
  // init state
  const initialState = [];

  // Reducer
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Allows a message, type of alert, and timeout default : 5s
  const setAlert = (msg, type, timeout = 5000) => {
    // For tracking Alerts
    const id = uuid.v4();

    // Setting alert via reducer
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id }
    });

    // remove alert with state change
    setTimeout(() => {
      dispatch({
        type: REMOVE_ALERT,
        payload: id
      });
    }, timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}
    >
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
