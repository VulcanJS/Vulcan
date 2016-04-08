import React from 'react';

const CommentList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore}) => {

  ({LoadMore, Loading, NoPosts, NoMorePosts, CommentNode} = Telescope.components);
  
  if (!!results.length) {
    return (
      <div className="comments-list">
        {results.map(comment => <CommentNode comment={comment} key={comment._id} currentUser={currentUser}/>)}
        {hasMore ? (ready ? <LoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <Loading/>) : <NoMorePosts/>}
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

module.exports = CommentList;