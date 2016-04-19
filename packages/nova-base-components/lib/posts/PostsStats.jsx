import React from 'react';

const PostsStats = ({post}) => {

  ({Icon} = Telescope.components);

  return (
    <div className="posts-stats">
      {post.score ? <span className="posts-stats-item" title="Score"><Icon name="score"/> {Math.floor(post.score*10000)/10000} <span className="sr-only">Score</span></span> : ""}
      <span className="posts-stats-item" title="Upvotes"><Icon name="upvote"/> {post.upvotes} <span className="sr-only">Upvotes</span></span>
      <span className="posts-stats-item" title="Clicks"><Icon name="clicks"/> {post.clickCount} <span className="sr-only">Clicks</span></span>
      <span className="posts-stats-item" title="Views"><Icon name="views"/> {post.viewCount} <span className="sr-only">Views</span></span>
    </div>
  )
}

module.exports = PostsStats;
export default PostsStats;