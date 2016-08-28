import Telescope from 'meteor/nova:lib';
import React from 'react';

const PostsLoading = props => {
  const Loading = Telescope.components.Loading;
  return <div className="posts-load-more-loading"><Loading/></div>
}

PostsLoading.displayName = "PostsLoading";

module.exports = PostsLoading;