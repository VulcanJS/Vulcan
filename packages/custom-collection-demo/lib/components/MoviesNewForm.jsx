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
      currentUser={props.currentUser} 
      successCallback={document => { 
        context.closeCallback();
      }}
      removeSuccessCallback={({ documentId, documentTitle }) => {
        context.closeCallback();
      }}
      queryName="moviesListQuery"
    />
  )
}

MoviesNewForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}

export default MoviesNewForm;