import React, { PropTypes, Component } from 'react';

class CommentNode extends Component {

  renderComment(comment) {
    
    ({CommentItem} = Telescope.components);

    return (
      <CommentItem comment={comment} key={comment._id} currentUser={this.props.currentUser}/>
    )
  }

  renderChildren(children) {
    return (
      <div className="comment-children">
        {children.map(comment => <CommentNode comment={comment} key={comment._id} currentUser={this.props.currentUser}/>)}
      </div>
    )
  }

  render() {

    const comment = this.props.comment;
    const children = this.props.comment.childrenResults;
    
    return (
      <div className="comment-node">
        {this.renderComment(comment)}
        {children ? this.renderChildren(children) : ""}
      </div>
    )
  }

};

CommentNode.propTypes = {
  comment: React.PropTypes.object.isRequired, // the current comment
  currentUser: React.PropTypes.object, // the current user
}

module.exports = CommentNode;