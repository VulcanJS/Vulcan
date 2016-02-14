PostList = props => {
  return (
    <div className="postList">
      {props.posts.map(post => <h3 key={post.title}>{post.title}</h3>)}
    </div>
  )
};