/* 

A component to configure the "new movie" form.

*/

import React, { PropTypes, Component } from 'react';
import SmartForm from "meteor/nova:forms";
import Movies from '../collection.js';
import { MoviesListFragment } from './MoviesList.jsx';
import { withMessages } from 'meteor/nova:core';

const MoviesNewForm = (props, context) => {
  return (
    <SmartForm 
      collection={Movies}
      mutationFragment={MoviesListFragment}
    />
  )
}

MoviesNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}
export default withMessages(MoviesNewForm);
