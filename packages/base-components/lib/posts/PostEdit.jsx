const PostEdit = props => {
  return (
    <div className="post">
      <h3>Editing post “{props.title}”</h3>
      <textarea>{props.body}</textarea>
    </div>
  )
}

module.exports = PostEdit;