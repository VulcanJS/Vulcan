const PostItemCommenters = props => {
  return (
    <ul className="post-commenters">
      <li>Comments by:</li>
      {props.commentersArray.map(commenter => <li key={commenter._id}>{Users.getDisplayName(commenter)}</li>)}
    </ul>
  )
}

module.exports = PostItemCommenters;