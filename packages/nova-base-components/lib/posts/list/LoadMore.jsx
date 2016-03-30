import React from 'react';

const LoadMore = ({loadMore, count, totalCount}) => {
  const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
  return <button className="post-load-more" onClick={loadMore}>{label}</button>
}

module.exports = LoadMore;