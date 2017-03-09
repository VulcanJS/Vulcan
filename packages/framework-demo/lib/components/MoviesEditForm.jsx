/* 

A component to configure the "edit movie" form.
Wrapped with the "withDocument" container.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/nova:core";
import Movies from '../modules/collection.js';

const MoviesEditForm = props =>
  <Components.SmartForm 
    collection={Movies} 
    documentId={props.documentId}
    mutationFragment={getFragment('MoviesItemFragment')}
    showRemove={true}
    successCallback={document => {
      props.closeModal();
    }}
  />

registerComponent('MoviesEditForm', MoviesEditForm);
