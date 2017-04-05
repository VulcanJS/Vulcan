import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';
import { Link } from 'react-router';
import Posts from "meteor/vulcan:posts";

const PostsCommenters = ({post}) => {
  return (
    <div className="posts-commenters">
      <div className="posts-commenters-avatars">
        {_.take(post.commenters, 4).map(user => <Components.UsersAvatar key={user._id} user={user}/>)}
      </div>
      <div className="posts-commenters-discuss">
        <Link to={Posts.getPageUrl(post)}>
          <Components.Icon name="comment" />
          <span className="posts-commenters-comments-count">{post.commentCount}</span>
          <span className="sr-only">Comments</span>
        </Link>
      </div>
    </div>
  );
};

PostsCommenters.displayName = "PostsCommenters";

registerComponent('PostsCommenters', PostsCommenters);