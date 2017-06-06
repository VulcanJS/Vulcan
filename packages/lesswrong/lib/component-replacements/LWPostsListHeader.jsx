import { Components, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';

const LWPostsListHeader = () => {

  return (
    <div>
      <div className="posts-list-header">
        <Components.PostsViews />
        <Components.SearchForm/>
      </div>
    </div>
  )
}

LWPostsListHeader.displayName = "PostsListHeader";

replaceComponent('PostsListHeader', LWPostsListHeader);
