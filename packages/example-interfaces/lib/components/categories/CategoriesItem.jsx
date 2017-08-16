/* 

An item in the categories list.
Wrapped with the "withCurrentUser" container.

*/

import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import Categories from '../../modules/categories/collection.js';
import CategoriesEditForm from './CategoriesEditForm.jsx';
import CategoriesNewForm from './CategoriesNewForm.jsx';
import CategoriesList from './CategoriesList.jsx';

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
          <CategoriesEditForm currentUser={currentUser} documentId={category._id} />
        </Components.ModalTrigger>
        : null
      }

      {/* edit document form */}

      {Categories.options.mutations.new.check(currentUser) ?
        <Components.ModalTrigger label={`New child`}>
          <CategoriesNewForm parentId={category._id}/>
        </Components.ModalTrigger>
        : null
      }

    </div>

    <CategoriesList terms={{ parentId: category._id, view: 'childrenCategories' }} />

  </div>

export default CategoriesItem;
