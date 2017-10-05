/* 

An item in the categories list.
Wrapped with the "withCurrentUser" container.

*/

import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import Categories from '../../modules/categories/collection.js';

const CategoriesItem = ({category, currentUser}) =>

  <div className={`category ${category.parentId ? "child-category" : "top-category"}`} >

    <div className="category-header">

      {/* document properties */}
      {category.parentId
        ? <h5>{category.name}</h5>
        : <h4>{category.name}</h4>
      }

      {/* edit document form */}

      {Categories.options.mutations.edit.check(currentUser, category) ?
        <Components.ModalTrigger label="Edit" >
          <Components.CategoriesEditForm currentUser={currentUser} documentId={category._id} />
        </Components.ModalTrigger>
        : null
      }

      {/* edit document form */}

      {Categories.options.mutations.new.check(currentUser) ?
        <Components.ModalTrigger label={`New child`}>
          <Components.CategoriesNewForm parentId={category._id}/>
        </Components.ModalTrigger>
        : null
      }

    </div>

    <Components.CategoriesList terms={{ parentId: category._id, view: 'childrenCategories' }} />

  </div>

registerComponent('CategoriesItem', CategoriesItem);
