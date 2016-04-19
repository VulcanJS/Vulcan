import React from 'react';

const PostsList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore, showHeader = true}) => {

  // console.log(results);
  // console.log(ready);
  // console.log(hasMore);
  // console.log(totalCount);
  // console.log(count);

  ({PostsItem, PostsLoadMore, PostsLoading, PostsNoResults, PostsNoMore, PostsListHeader} = Telescope.components);

  if (!!results.length) {
    return (
      <div className="posts-list">
        {showHeader ? <PostsListHeader /> : null}
        <div className="posts-list-content">
          {results.map(post => <PostsItem post={post} currentUser={currentUser} key={post._id}/>)}
        </div>
        {hasMore ? (ready ? <PostsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <PostsLoading/>) : <PostsNoMore/>}
      </div>
    )
  } else if (!ready) {
    return (
      <div className="posts-list">
        {showHeader ? <PostsListHeader /> : null}
        <div className="posts-list-content">
          <PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="posts-list">
        {showHeader ? <PostsListHeader /> : null}
        <div className="posts-list-content">
          <PostsNoResults/>
        </div>
      </div>
    )  
  }
  
};

module.exports = PostsList;