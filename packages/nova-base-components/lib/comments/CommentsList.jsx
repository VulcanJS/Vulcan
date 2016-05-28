import React from 'react';

const CommentsList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore}) => {

  if (!!results.length) {
    return (
      <div className="comments-list">
        {results.map(comment => <Telescope.components.CommentsNode comment={comment} key={comment._id} currentUser={currentUser}/>)}
        {hasMore ? (ready ? <Telescope.components.CommentsLoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Telescope.components.Loading/>) : null}
      </div>
    )
  } else if (!ready) {
    return (
      <div className="comments-list">
        <Telescope.components.Loading/>
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

CommentsList.displayName = "CommentsList";

module.exports = CommentsList;