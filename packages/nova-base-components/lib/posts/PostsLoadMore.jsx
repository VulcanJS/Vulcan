import React from 'react';

const PostsLoadMore = ({loadMore, count, totalCount}) => {
  return (
    <a className="posts-load-more" onClick={loadMore}>
      <span>Load More</span>
      {totalCount ? <span className="load-more-count">{`(${count}/${totalCount})`}</span> : null}
    </a>
  )
}

PostsLoadMore.displayName = "PostsLoadMore";

module.exports = PostsLoadMore;