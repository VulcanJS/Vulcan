import React from 'react';

const PostsStats = ({post}) => {

  return (
    <div className="posts-stats">
      {post.score ? <span className="posts-stats-item" title="Score"><Telescope.components.Icon name="score"/> {Math.floor(post.score*10000)/10000} <span className="sr-only">Score</span></span> : ""}
      <span className="posts-stats-item" title="Upvotes"><Telescope.components.Icon name="upvote"/> {post.upvotes} <span className="sr-only">Upvotes</span></span>
      <span className="posts-stats-item" title="Clicks"><Telescope.components.Icon name="clicks"/> {post.clickCount} <span className="sr-only">Clicks</span></span>
      <span className="posts-stats-item" title="Views"><Telescope.components.Icon name="views"/> {post.viewCount} <span className="sr-only">Views</span></span>
    </div>
  )
}

PostsStats.displayName = "PostsStats";

module.exports = PostsStats;
export default PostsStats;