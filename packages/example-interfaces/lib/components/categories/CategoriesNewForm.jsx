/* 

A component to configure the "new category" form.

*/

import React from 'react';
import { Components, registerComponent, withCurrentUser, getFragment } from 'meteor/vulcan:core';

import Categories from '../../modules/categories/collection.js';

const CategoriesNewForm = ({currentUser, closeModal, parentId}) =>

  <div>

    {Categories.options.mutations.new.check(currentUser) ?
      <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ccc'}}>
        <h4>Insert New Document</h4>
        <Components.SmartForm 
          collection={Categories}
          mutationFragment={getFragment('CategoriesItemFragment')}
          successCallback={document => {
            closeModal();
          }}
          prefilledProps={{
            parentId,
          }}
        /> 
      </div> :
      null
    }

  </div>

registerComponent('CategoriesNewForm', CategoriesNewForm, withCurrentUser);