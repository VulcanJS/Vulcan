/* 

A component to configure the "edit movie" form.
Wrapped with the "withSingle" container.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Movies from '../collection.js';
import { compose } from 'react-apollo';

const MoviesEditForm = (props, context) => {
  return (
    <NovaForm 
      collection={Movies} 
      documentId={props.documentId}
      refetch={props.refetch}
      queryToUpdate="moviesListQuery"
      showRemove={true}
    />
  )
}

MoviesEditForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}

export default MoviesEditForm;