import React from 'react';

const PostsCommenters = ({post}) => {
  return (
    <div className="posts-commenters">
      <div className="posts-commenters-avatars">
        {post.commentersArray.map(user => <UsersAvatar key={user._id} user={user}/>)}
      </div>
      <div className="posts-commenters-discuss">
        <a href={Posts.getPageUrl(post)}>
          <Icon name="comment" />
          <span className="posts-commenters-comments-count">{post.commentCount}</span>
          <span className="sr-only">Comments</span>
        </a>
      </div>
    </div>
  )
}

module.exports = PostsCommenters;
export default PostsCommenters;