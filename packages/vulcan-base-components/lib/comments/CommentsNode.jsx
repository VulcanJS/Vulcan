import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class CommentsNode extends PureComponent {

  renderComment(comment) {

    return (
      <Components.CommentsItem comment={comment} key={comment._id} />
    )
  }

  renderChildren(children) {
    return (
      <div className="comments-children">
        {children.map(comment => <CommentsNode comment={comment} key={comment._id} />)}
      </div>
    )
  }

  render() {

    const comment = this.props.comment;
    const children = this.props.comment.childrenResults;

    return (
      <div className="comments-node">
        {this.renderComment(comment)}
        {children ? this.renderChildren(children) : null}
      </div>
    )
  }

}

CommentsNode.propTypes = {
  comment: PropTypes.object.isRequired, // the current comment
};

registerComponent('CommentsNode', CommentsNode);
