/* 

A component to configure the "edit movie" form.
Wrapped with the "withDocument" container.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from "meteor/nova:core";
import Movies from '../collection.js';

const MoviesEditForm = (props, context) => {
  return (
    <Components.SmartForm 
      collection={Movies} 
      documentId={props.documentId}
      showRemove={true}
    />
  )
}

MoviesEditForm.contextTypes = {
  closeCallback: React.PropTypes.func,
}

registerComponent('MoviesEditForm', MoviesEditForm);
