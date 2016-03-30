import React from 'react';

const CommentList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore}) => {

  ({LoadMore, PostsLoading, NoPosts, NoMorePosts, CommentNode} = Telescope.components);
  
  if (!!results.length) {
    return (
      <div className="commentList">
        {results.map(comment => <CommentNode comment={comment} key={comment._id} currentUser={currentUser}/>)}
        {hasMore ? (ready ? <LoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <PostsLoading/>) : <NoMorePosts/>}
      </div>
    )
  } else if (!ready) {
    return (
      <div className="commentList">
        <PostsLoading/>
      </div>
    )
  } else {
    return (
      <div className="commentList">
        <NoPosts/>
      </div>
    )  
  }
  
};

module.exports = CommentList;