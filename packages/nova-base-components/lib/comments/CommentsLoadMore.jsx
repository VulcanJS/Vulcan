import React from 'react';

const CommentsLoadMore = ({loadMore, count, totalCount}) => {
  const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
  return <a className="comments-load-more" onClick={loadMore}>{label}</a>
}

CommentsLoadMore.displayName = "CommentsLoadMore";

module.exports = CommentsLoadMore;