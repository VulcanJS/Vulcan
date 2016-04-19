import React from 'react';

const PostsLoadMore = ({loadMore, count, totalCount}) => {
  const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
  return <button className="posts-load-more" onClick={loadMore}>{label}</button>
}

module.exports = PostsLoadMore;