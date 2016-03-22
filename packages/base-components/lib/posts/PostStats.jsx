const PostStats = ({post}) => {

  ({Icon} = Telescope.components);

  return (
    <div className="post-stats">
      {post.score ? <span title="Score"><Icon name="score"/> {Math.floor(post.score*10000)/10000} <span className="sr-only">Score</span></span> : ""}
      <span title="Upvotes"><Icon name="upvote"/> {post.upvotes} <span className="sr-only">Upvotes</span></span>
      <span title="Clicks"><Icon name="clicks"/> {post.clickCount} <span className="sr-only">Clicks</span></span>
      <span title="Views"><Icon name="views"/> {post.viewCount} <span className="sr-only">Views</span></span>
    </div>
  )
}

module.exports = PostStats;
export default PostStats;