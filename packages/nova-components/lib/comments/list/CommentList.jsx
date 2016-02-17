const CommentList = props => {

  ({CommentItem, LoadMore, PostsLoading, NoPosts, NoMorePosts} = Telescope.components);

  if (!!props.results.length) {
    return (
      <div className="commentList">
        {props.results.map(comment => <CommentItem {...comment} key={comment._id}/>)}
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