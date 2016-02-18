const Post = (props) => {
  
  ({ListContainer, CommentList} = Telescope.components);

  const htmlBody = {__html: props.htmlBody};

  return (
    <div className="post">

      <h3>{props.title}</h3>
      <p>{props.commentCount} comments</p>
      <p>{moment(props.postedAt).fromNow()}</p>
      <div dangerouslySetInnerHTML={htmlBody}></div>

      <div className="comments-thread">
        <h4>Comments</h4>
        <ListContainer 
          collection={Comments} 
          publication="comments.list" 
          selector={{postId: props._id}} 
          terms={{postId: props._id, view: "postComments"}} 
          component={CommentList} 
          limit={0}
        />
      </div>

    </div>
  )
}

module.exports = Post;