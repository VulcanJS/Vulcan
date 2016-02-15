const Post = (props) => {
  return (
    <div className="post">
      <h3>{props.title}</h3>
      <p>{moment(props.postedAt).fromNow()}</p>
      <p>{props.body}</p>
    </div>
  )
}

module.exports = Post;