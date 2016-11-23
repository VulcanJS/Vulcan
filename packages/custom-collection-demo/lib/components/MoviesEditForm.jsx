/* 

A component to configure the "edit movie" form.
Wrapped with the "withSingle" container.

*/

import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Movies from '../collection.js';
import { withSingle } from 'meteor/nova:core';
import { compose } from 'react-apollo';
import fragments from '../fragments.js';

const MoviesEditForm = (props, context) => {
  return (
    <NovaForm 
      collection={Movies} 
      currentUser={props.currentUser} 
      document={props.document} 
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

const options = {
  collection: Movies,
  queryName: 'moviesEditQuery',
  fragmentName: fragments.single.name,
  fragment: fragments.single.fragment,
};

export default compose(withSingle(options))(MoviesEditForm);