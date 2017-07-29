/*

 Main page.

*/

import React from 'react';
import { Components, withCurrentUser } from 'meteor/vulcan:core';

import Categories from '../../modules/categories/collection.js';
import CategoriesList from './CategoriesList';
import CategoriesNewForm from './CategoriesNewForm.jsx';

const CategoriesPage = ({results = [], currentUser, loading, loadMore, count, totalCount}) =>

  <div style={{maxWidth: '500px', margin: '20px auto'}}>

    <CategoriesList terms={{ view: 'topLevelCategories' }} />

    {/* new document form */}

    {Categories.options.mutations.new.check(currentUser) ?
      <Components.ModalTrigger label="New Category">
        <CategoriesNewForm />
      </Components.ModalTrigger>
      : null
    }

  </div>

export default withCurrentUser(CategoriesPage);
