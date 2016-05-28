import React from 'react';

import SmartContainers from "meteor/utilities:react-list-container";
const ListContainer = SmartContainers.ListContainer;

const PostsListHeader = () => {

  return (
    <div>
      <div className="posts-list-header">
        <div className="posts-lists-header-categories">
          <ListContainer collection={Categories} limit={0} resultsPropName="categories" component={Telescope.components.CategoriesList}/>
        </div>
        <Telescope.components.PostsViews />
        <Telescope.components.SearchForm/>
      </div>
    </div>
  )
}

PostsListHeader.displayName = "PostsListHeader";

module.exports = PostsListHeader;
export default PostsListHeader;