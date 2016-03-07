const CommentList = props => {

  ({LoadMore, PostsLoading, NoPosts, NoMorePosts, CommentNode} = Telescope.components);
  
  if (!!props.results.length) {
    return (
      <div className="commentList">
        {props.results.map(comment => <CommentNode comment={comment} key={comment._id} currentUser={props.currentUser}/>)}
        {props.hasMore ? (props.ready ? <LoadMore {...props}/> : <PostsLoading/>) : <NoMorePosts/>}
      </div>
    )
  } else if (!props.ready) {
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