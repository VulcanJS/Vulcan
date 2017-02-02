import { Components, registerComponent } from 'meteor/nova:core';
import React from 'react';

const PostsLoading = props => {
  return <div className="posts-load-more-loading"><Components.Loading/></div>
};

PostsLoading.displayName = "PostsLoading";

registerComponent('PostsLoading', PostsLoading);