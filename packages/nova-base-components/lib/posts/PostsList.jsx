import Telescope from 'meteor/nova:lib';
import React from 'react';

const PostsList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore, refetchQuery, showHeader = true}) => {

  if (!!results.length) {
    return (
      <div className="posts-list">
        {showHeader ? <Telescope.components.PostsListHeader/> : null}
        <div className="posts-list-content">
          {results.map(post => <Telescope.components.PostsItem post={post} key={post._id} refetchQuery={refetchQuery} />)}
        </div>
        {hasMore ? (ready ? <Telescope.components.PostsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Telescope.components.PostsLoading/>) : <Telescope.components.PostsNoMore/>}
      </div>
    )
  // note: we're handling the "loading" case in the container now
  // } else if (!ready) {
  //   return (
  //     <div className="posts-list">
  //       {showHeader ? <Telescope.components.PostsListHeader /> : null}
  //       <div className="posts-list-content">
  //         <Telescope.components.PostsLoading/>
  //       </div>
  //     </div>
  //   )
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

module.exports = PostsList;