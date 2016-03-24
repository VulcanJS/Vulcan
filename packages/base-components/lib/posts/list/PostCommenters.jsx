const PostCommenters = ({post}) => {
  return (
    <div className="post-comments">
      <div className="post-commenters">
        {post.commentersArray.map(user => <UserAvatar key={user._id} user={user}/>)}
      </div>
      <div className="post-discuss">
        <a href={Posts.getLink(post)}>
          <Icon name="comment" />
          <span className="post-comments-count">{post.commentCount}</span>
          <span className="sr-only">Comments</span>
        </a>
      </div>
    </div>
  )
}

module.exports = PostCommenters;
export default PostCommenters;