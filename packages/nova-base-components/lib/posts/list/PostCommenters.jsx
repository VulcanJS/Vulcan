import React from 'react';

const PostCommenters = ({post}) => {
  return (
    <div className="post-commenters">
      <div className="post-commenters-avatars">
        {post.commentersArray.map(user => <UserAvatar key={user._id} user={user}/>)}
      </div>
      <div className="post-discuss">
        <a href={Posts.getPageUrl(post)}>
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