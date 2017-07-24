import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const CommentsLoadMore = ({loadMore, count, totalCount}) => {
  const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
  return <a className="comments-load-more" onClick={e => { e.preventDefault(); loadMore();}}>{label}</a>
}

CommentsLoadMore.displayName = "CommentsLoadMore";

registerComponent('CommentsLoadMore', CommentsLoadMore);