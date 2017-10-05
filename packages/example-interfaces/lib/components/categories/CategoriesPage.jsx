/*

 Main page.

*/

import React from 'react';
import { registerComponent, Components, withCurrentUser } from 'meteor/vulcan:core';

import Categories from '../../modules/categories/collection.js';

const CategoriesPage = ({results = [], currentUser, loading, loadMore, count, totalCount}) =>

  <div style={{maxWidth: '500px', margin: '20px auto'}}>

    <Components.CategoriesList terms={{ view: 'topLevelCategories' }} />

    {/* new document form */}

    {Categories.options.mutations.new.check(currentUser) ?
      <Components.ModalTrigger label="New Category">
        <Components.CategoriesNewForm />
      </Components.ModalTrigger>
      : null
    }

  </div>

registerComponent('CategoriesPage', CategoriesPage, withCurrentUser);