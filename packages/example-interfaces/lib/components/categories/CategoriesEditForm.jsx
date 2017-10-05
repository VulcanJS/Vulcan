/* 

A component to configure the "edit category" form.

*/

import React from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";

import Categories from '../../modules/categories/collection.js';

const CategoriesEditForm = ({documentId, closeModal}) =>

  <Components.SmartForm 
    collection={Categories}
    documentId={documentId}
    mutationFragment={getFragment('CategoriesItemFragment')}
    showRemove={false} // not properly implemented in the example package
    successCallback={document => {
      closeModal();
    }}
  />

registerComponent('CategoriesEditForm', CategoriesEditForm);