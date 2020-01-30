import React, { Fragment } from 'react';
import spinner from './spinner.gif';
import authContext from '../../context/auth/AuthContext';

export default () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='Loading...'
    />
  </Fragment>
);
