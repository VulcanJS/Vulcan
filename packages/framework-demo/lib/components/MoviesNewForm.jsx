/* 

A component to configure the "new movie" form.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Movies from '../collection.js';

const MoviesNewForm = (props, context) => {
  return (
    <NovaForm 
      collection={Movies} 
      queryToUpdate="moviesListQuery"
      refetch={props.refetch}
    />
  )
}

MoviesNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}

export default MoviesNewForm;