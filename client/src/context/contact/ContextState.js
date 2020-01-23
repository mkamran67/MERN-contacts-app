import React, { useReducer } from 'react';
import uuid from 'uuid'; // to generate a random ID
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER,
  SET_ALERT,
  REMOVE_ALERT
} from '../types';

const ContactState = props => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: 'Jill John',
        email: 'jill@gmail.com',
        phone: '111-111-1111',
        type: 'personal'
      },
      {
        id: 2,
        name: 'jane John',
        email: 'jane@gmail.com',
        phone: '111-222-1111',
        type: 'personal'
      },
      {
        id: 3,
        name: 'muscles John',
        email: 'muscles@gmail.com',
        phone: '111-111-3333',
        type: 'professional'
      }
    ]
  };

  // reducer
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // Add Contact

  // Delete Contact

  // Set Current Contact

  // Clear Current Contact

  // Update Contact CRUD

  // Filter Contacts

  // Clear Filter

  // return our provider

  return (
    // value is what's accessible
    <ContactContext.Provider value={{ contacts: state.contacts }}>
      {props.children}
    </ContactContext.Provider>
  );
};

export default ContactState;
