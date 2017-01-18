/* 

A component to configure the "new movie" form.

*/

import React, { PropTypes, Component } from 'react';
import Movies from '../collection.js';
import { MoviesListFragment } from './MoviesList.jsx';
import { Components, registerComponent, withMessages } from 'meteor/nova:core';

const MoviesNewForm = (props, context) => {
  return (
    <Components.SmartForm 
      collection={Movies}
      mutationFragment={MoviesListFragment}
    />
  )
}

MoviesNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}

registerComponent('MoviesNewForm', MoviesNewForm, withMessages);
