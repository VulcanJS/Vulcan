import { registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const PostsLoadMore = ({loadMore, count, totalCount}) => {
  return (
    <a className="posts-load-more" href="#" onClick={e => {e.preventDefault(); loadMore();}}>
      <span><FormattedMessage id="posts.load_more"/></span>
      &nbsp;
      {totalCount ? <span className="load-more-count">{`(${count}/${totalCount})`}</span> : null}
    </a>
  )
}

PostsLoadMore.displayName = "PostsLoadMore";

registerComponent('PostsLoadMore', PostsLoadMore);
