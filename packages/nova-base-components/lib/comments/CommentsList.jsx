import React from 'react';

const CommentsList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore}) => {

  ({CommentsLoadMore, Loading, PostsNoResults, PostsNoMore, CommentsNode} = Telescope.components);
  
  if (!!results.length) {
    return (
      <div className="comments-list">
        {results.map(comment => <CommentsNode comment={comment} key={comment._id} currentUser={currentUser}/>)}
        {hasMore ? (ready ? <CommentsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Loading/>) : null}
      </div>
    )
  } else if (!ready) {
    return (
      <div className="comments-list">
        <Loading/>
      </div>
    )
  } else {
    return (
      <div className="comments-list">
        <p>No comments to display.</p>
      </div>
    )  
  }
  
};

module.exports = CommentsList;