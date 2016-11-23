/* 

A component to configure the "edit movie" form.
Wrapped with the "withSingle" container.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Movies from '../collection.js';
import { compose } from 'react-apollo';
import fragments from '../fragments.js';

const MoviesEditForm = (props, context) => {
  return (
    <NovaForm 
      collection={Movies} 
      currentUser={props.currentUser} 
      documentId={props.documentId} 
      successCallback={document => { 
        context.closeCallback();
      }}
      queryName="moviesListQuery"
      showRemove={true}
    />
  )
}

MoviesEditForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}

export default MoviesEditForm;