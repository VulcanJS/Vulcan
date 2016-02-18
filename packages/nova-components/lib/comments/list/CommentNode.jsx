const CommentNode = React.createClass({

  propTypes: {
    comment: React.PropTypes.object.isRequired, // the current comment
  },

  renderComment(comment) {
    
    ({CommentItem} = Telescope.components);

    return (
      <CommentItem {...comment} key={comment._id}/>
    )
  },

  renderChildren(children) {

    // ({CommentNode} = Telescope.components);

    return (
      <div className="comment-children">
        {children.map(comment => <CommentNode comment={comment} key={comment._id}/>)}
      </div>
    )
  },

  render() {

    const comment = this.props.comment;
    const children = this.props.comment.childrenResults;
    
    return (
      <div className="comment-node" style={{borderLeft:"2px solid #eee", paddingLeft: "10px"}}>
        {this.renderComment(comment)}
        {children ? this.renderChildren(children) : ""}
      </div>
    )
  }

});

module.exports = CommentNode;