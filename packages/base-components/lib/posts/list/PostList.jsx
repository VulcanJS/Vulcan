const PostList = props => {

  ({PostItem, LoadMore, PostsLoading, NoPosts, NoMorePosts, PostViews} = Telescope.components);

  if (!!props.results.length) {
    return (
      <div className="postList">
        <PostViews />
        <div className="post-list-content">
          {props.results.map(post => <PostItem post={post} currentUser={props.currentUser} key={post._id}/>)}
        </div>
        {props.hasMore ? (props.ready ? <LoadMore {...props}/> : <PostsLoading/>) : <NoMorePosts/>}
      </div>
    )
  } else if (!props.ready) {
    return (
      <div className="postList">
        <PostsLoading/>
      </div>
    )
  } else {
    return (
      <div className="postList">
        <NoPosts/>
      </div>
    )  
  }
  
};

module.exports = PostList;