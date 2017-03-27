/* 

A component to configure the "edit comment" form.
Wrapped with the "withDocument" container.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";

import Comments from '../../modules/comments/collection.js';

const CommentsEditForm = ({documentId, closeModal}) =>

  <Components.SmartForm 
    collection={Comments}
    documentId={documentId}
    mutationFragment={getFragment('CommentsItemFragment')}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
  />

export default CommentsEditForm;