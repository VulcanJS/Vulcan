const CommentItem = props => {
  return (
    <li className="comment">
      <p>{props.htmlBody}</p>
    </li>
  )
};

module.exports = CommentItem;