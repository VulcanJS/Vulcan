import React from 'react';

const PostsLoadMore = ({loadMore, count, totalCount}) => {
  const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
  return <a className="posts-load-more" onClick={loadMore}>{label}</a>
}

PostsLoadMore.displayName = "PostsLoadMore";

module.exports = PostsLoadMore;