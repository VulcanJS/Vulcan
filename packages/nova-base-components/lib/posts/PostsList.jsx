import Telescope from 'meteor/nova:lib';
import React from 'react';
import { withPostsList } from 'meteor/nova:base-containers';

const PostsList = (props) => {

  const {results, terms, hasMore, loading, count, totalCount, loadMore, showHeader = true} = props

  if (results && results.length) {
    return (
      <div className="posts-list">
        {showHeader ? <Telescope.components.PostsListHeader/> : null}
        <div className="posts-list-content">
          {results.map(post => <Telescope.components.PostsItem post={post} key={post._id} />)}
        </div>
        {hasMore ? (ready ? <Telescope.components.PostsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Telescope.components.PostsLoading/>) : <Telescope.components.PostsNoMore/>}
      </div>
    )
  } else if (loading) {
    return (
      <div className="posts-list">
        {showHeader ? <Telescope.components.PostsListHeader /> : null}
        <div className="posts-list-content">
          <Telescope.components.PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="posts-list">
        {showHeader ? <Telescope.components.PostsListHeader /> : null}
        <div className="posts-list-content">
          <Telescope.components.PostsNoResults/>
        </div>
      </div>
    )  
  }
  
};

PostsList.displayName = "PostsList";

PostsList.propTypes = {

};

module.exports = withPostsList({})(PostsList);