import React from 'react';

const PostsLoading = props => {
  const Loading = Telescope.components.Loading;
  return <div className="post-load-more-loading"><Loading/></div>
}

module.exports = PostsLoading;