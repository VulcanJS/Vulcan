const PostList = ({results, currentUser, hasMore, ready, count, totalCount, loadMore, showViews = true}) => {

  // console.log(results);
  // console.log(ready);

  ({PostItem, LoadMore, PostsLoading, NoPosts, NoMorePosts, PostViews} = Telescope.components);

  if (!!results.length) {
    return (
      <div className="postList">
        {showViews ? <PostViews /> : null}
        <div className="post-list-content">
          {results.map(post => <PostItem post={post} currentUser={currentUser} key={post._id}/>)}
        </div>
        {hasMore ? (ready ? <LoadMore loadMore={loadMore} count={count} totalCount={totalCount} /> : <PostsLoading/>) : <NoMorePosts/>}
      </div>
    )
  } else if (!ready) {
    return (
      <div className="postList">
        {showViews ? <PostViews /> : null}
        <div className="post-list-content">
          <PostsLoading/>
        </div>
      </div>
    )
  } else {
    return (
      <div className="postList">
        {showViews ? <PostViews /> : null}
        <div className="post-list-content">
          <NoPosts/>
        </div>
      </div>
    )  
  }
  
};

module.exports = PostList;