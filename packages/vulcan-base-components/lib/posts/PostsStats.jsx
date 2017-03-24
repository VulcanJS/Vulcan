import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const PostsStats = ({post}) => {

  return (
    <div className="posts-stats">
      {post.score ? <span className="posts-stats-item" title="Score"><Components.Icon name="score"/> {Math.floor(post.score*10000)/10000} <span className="sr-only">Score</span></span> : ""}
      <span className="posts-stats-item" title="Upvotes"><Components.Icon name="upvote"/> {post.upvotes} <span className="sr-only">Upvotes</span></span>
      <span className="posts-stats-item" title="Clicks"><Components.Icon name="clicks"/> {post.clickCount} <span className="sr-only">Clicks</span></span>
      <span className="posts-stats-item" title="Views"><Components.Icon name="views"/> {post.viewCount} <span className="sr-only">Views</span></span>
    </div>
  )
}

PostsStats.displayName = "PostsStats";

registerComponent('PostsStats', PostsStats);