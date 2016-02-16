const PostList = props => {

  const PostItem = Telescope.getComponent("PostItem");
  const LoadMore = Telescope.getComponent("LoadMore");
  const PostsLoading = Telescope.getComponent("PostsLoading");
  const NoPosts = Telescope.getComponent("NoPosts");
  const NoMorePosts = Telescope.getComponent("NoMorePosts");

  if (!!props.results.length) {
    return (
      <div className="postList">
        {props.results.map(post => <PostItem {...post} key={post._id}/>)}
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