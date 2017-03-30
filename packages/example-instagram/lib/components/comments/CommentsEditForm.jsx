/* 

A component to configure the "edit comment" form.

Components.SmartForm props:

- collection: the collection in which to edit a document
- documentId: the id of the document to edit
- mutationFragment: the GraphQL fragment defining the data returned by the mutation
- showRemove: whether to show the "delete document" action in the form
- successCallback: what to do after the mutation succeeds

Note: `closeModal` is available as a prop because this form will be opened
in a modal popup. 

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