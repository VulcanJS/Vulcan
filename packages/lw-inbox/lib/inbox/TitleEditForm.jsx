/*

A component to configure the "Edit Title" form.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";
import Conversations from '../collections/conversations/collection.js';

const TitleEditForm = props =>
  <Components.SmartForm
    collection={Conversations}
    documentId={props.documentId}
    mutationFragment={getFragment('editTitle')}
    successCallback={document => {
      props.closeModal();
    }}
  />

registerComponent('TitleEditForm', TitleEditForm);
