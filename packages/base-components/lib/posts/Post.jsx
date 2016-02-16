const Post = (props) => {
  ({ListContainer, CommentList} = Telescope.components);
  return (
    <div className="post">
      <h3>{props.title}</h3>
      <p>{props.commentCount} comments</p>
      <p>{moment(props.postedAt).fromNow()}</p>
      <p>{props.body}</p>
      <div className="comments-thread">
        <h4>Comments</h4>
        <ListContainer collection={Comments} publication="comments.list" terms={{postId: props._id, view: "postComments"}} component={CommentList} limit={0}/>
      </div>
    </div>
  )
}

module.exports = Post;