const Post = (props) => {
  
  ({ListContainer, CommentList, CommentNew, PostCategories} = Telescope.components);

  const htmlBody = {__html: props.htmlBody};

  return (
    <div className="post">

      <h3>{props.title}</h3>
      <p>{props.commentCount} comments</p>
      <p>{moment(props.postedAt).fromNow()}</p>
      {props.categoriesArray ? <PostCategories categories={props.categoriesArray} /> : ""}
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
          parentProperty="parentCommentId"
        />
        <h4>New Comment:</h4>
        <CommentNew type="comment" postId={props._id}/>
      </div>

    </div>
  )
}

module.exports = Post;