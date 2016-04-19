import React from 'react';

const CommentsLoadMore = ({loadMore, count, totalCount}) => {
  const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
  return <button className="comments-load-more" onClick={loadMore}>{label}</button>
}

module.exports = CommentsLoadMore;