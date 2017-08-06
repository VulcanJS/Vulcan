import { Components, replaceComponent } from 'meteor/vulcan:core';
import React from 'react';
import { FormattedMessage } from 'meteor/vulcan:i18n';
import classNames from 'classnames';

const PostsLoadMore = ({loading, loadMore, count, totalCount}) => {
  return (
    <div className={classNames('posts-load-more', {'posts-load-more-loading': loading})}>
      <a className="posts-load-more-link" href="#" onClick={e => {e.preventDefault(); loadMore();}}>
        Load More...
        &nbsp;
        {totalCount ? <span className="load-more-count">{`(${count}/${totalCount})`}</span> : null}
      </a>
      {loading ? <div className="posts-load-more-loader"><Components.Loading/></div> : null}
    </div>
  )
}

PostsLoadMore.displayName = "PostsLoadMore";

replaceComponent('PostsLoadMore', PostsLoadMore);
