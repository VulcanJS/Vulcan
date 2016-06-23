import React from 'react';
import { Link } from 'react-router';
import Posts from "meteor/nova:posts";

const PostsCommenters = ({post}) => {
  return (
    <div className="posts-commenters">
      <div className="posts-commenters-avatars">
        {post.commentersArray.map(user => <Telescope.components.UsersAvatar key={user._id} user={user}/>)}
      </div>
      <div className="posts-commenters-discuss">
        <Link to={Posts.getPageUrl(post)}>
          <Telescope.components.Icon name="comment" />
          <span className="posts-commenters-comments-count">{post.commentCount}</span>
          <span className="sr-only">Comments</span>
        </Link>
      </div>
    </div>
  )
}

PostsCommenters.displayName = "PostsCommenters";

module.exports = PostsCommenters;
export default PostsCommenters;