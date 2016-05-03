import React from 'react';

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const PostsListHeader = () => {

  ({PostsViews, SearchForm, CategoriesList} = Telescope.components)

  return (
    <div>
      <div className="posts-list-header">
        <div className="posts-lists-header-categories">
          <ListContainer collection={Categories} limit={0} resultsPropName="categories" component={CategoriesList}/>
        </div>
        <PostsViews />
        <SearchForm/>
      </div>
    </div>
  )
}

module.exports = PostsListHeader;
export default PostsListHeader;