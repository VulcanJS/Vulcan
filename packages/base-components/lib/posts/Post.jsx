const Post = (props) => {
  
  ({ListContainer, CommentList, CommentNew, PostCategories} = Telescope.components);

  const post = props.document;
  const htmlBody = {__html: post.htmlBody};

  return (
    <div className="post">

      <h3>{post.title}</h3>
      <p>{post.commentCount} comments</p>
      <p>{moment(post.postedAt).fromNow()}</p>
      {post.categoriesArray ? <PostCategories categories={post.categoriesArray} /> : ""}
      <div dangerouslySetInnerHTML={htmlBody}></div>

      <div className="comments-thread">
        <h4>Comments</h4>
        <ListContainer 
          collection={Comments} 
          publication="comments.list" 
          selector={{postId: post._id}} 
          terms={{postId: post._id, view: "postComments"}} 
          limit={0}
          parentProperty="parentCommentId"
        ><CommentList/></ListContainer>

        <div className="post-new-comment">
          <h4>New Comment:</h4>
          <CommentNew type="comment" postId={post._id} />
        </div>
      </div>

    </div>
  )
}

module.exports = Post;