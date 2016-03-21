const Post = ({document}) => {
  
  ({ListContainer, CommentList, CommentNew, PostCategories, SocialShare} = Telescope.components);

  const post = document;
  const htmlBody = {__html: post.htmlBody};
  return (
    <div className="post">

      <h3>{post.title}</h3>
      <HeadTags url={Posts.getLink(post)} title={post.title}/>
      <SocialShare url={ Posts.getLink(post) } title={ post.title }/>
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
          joins={Comments.getJoins()}
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