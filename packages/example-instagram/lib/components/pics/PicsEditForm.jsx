/* 

A component to configure the "edit pic" form.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";

import Pics from '../../modules/pics/collection.js';

const PicsEditForm = ({documentId, closeModal}) =>

  <Components.SmartForm 
    collection={Pics}
    documentId={documentId}
    mutationFragment={getFragment('PicsDetailsFragment')}
    showRemove={true}
    successCallback={document => {
      closeModal();
    }}
  />

export default PicsEditForm;