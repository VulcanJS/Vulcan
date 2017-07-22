/* 

List of categories.
Wrapped with the "withList" and "withCurrentUser" containers.

*/

import React from 'react';
import { Components, withList, withCurrentUser, Loading } from 'meteor/vulcan:core';

import Categories from '../../modules/categories/collection.js';
import CategoriesItem from './CategoriesItem.jsx';

const CategoriesList = ({results = [], terms: { parentId }, currentUser, loading, loadMore, count, totalCount}) =>
  
  <div className="category-list" >

    {loading ? 

      <Loading /> :

      <div className="categories">

        {/* documents list */}

        {results.map(category => <CategoriesItem key={category._id} category={category} currentUser={currentUser} />)}

        {/* load more */}

        {totalCount > results.length
          ? <a href="#" onClick={e => {e.preventDefault(); loadMore();}}>Load More ({count}/{totalCount})</a>
          : null
        }

      </div>
    }

  </div>

const options = {
  collection: Categories,
  fragmentName: 'CategoriesItemFragment',
  limit: 0,
};

export default withList(options)(withCurrentUser(CategoriesList));
