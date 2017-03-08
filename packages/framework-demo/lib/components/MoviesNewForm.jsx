/* 

A component to configure the "new movie" form.

*/

import React, { PropTypes, Component } from 'react';
import Movies from '../modules/collection.js';
import { Components, registerComponent, withMessages, getFragment } from 'meteor/nova:core';

const MoviesNewForm = props =>
  <Components.SmartForm 
    collection={Movies}
    mutationFragment={getFragment('MoviesItemFragment')}
    successCallback={document => {
      props.closeModal();
    }}
  />

registerComponent('MoviesNewForm', MoviesNewForm, withMessages);
