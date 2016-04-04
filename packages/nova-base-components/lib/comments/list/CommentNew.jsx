import React, { PropTypes, Component } from 'react';
import Actions from '../../actions.js';
import NovaForm from "meteor/nova:forms";

class CommentNew extends Component {

  render() {

    let prefilledProps = {postId: this.props.postId};

    if (this.props.parentComment) {
      prefilledProps = Object.assign(prefilledProps, {
        parentCommentId: this.props.parentComment._id,
        // if parent comment has a topLevelCommentId use it; if it doesn't then it *is* the top level comment
        topLevelCommentId: this.props.parentComment.topLevelCommentId || this.props.parentComment._id
      });
    }

    return (
      <div className="comment-new-form">
        <NovaForm 
          collection={Comments} 
          currentUser={this.context.currentUser}
          methodName="comments.new"
          prefilledProps={prefilledProps}
          successCallback={this.props.successCallback}
          labelFunction={(fieldName)=>Telescope.utils.getFieldLabel(fieldName, Comments)}
        />
        {this.props.type === "reply" ? <a className="comment-edit-cancel" onClick={this.props.cancelCallback}>Cancel</a> : null}
      </div>
    )
  }

};

CommentNew.propTypes = {
  postId: React.PropTypes.string.isRequired,
  type: React.PropTypes.string, // "comment" or "reply"
  parentComment: React.PropTypes.object, // if reply, the comment being replied to
  parentCommentId: React.PropTypes.string, // if reply
  topLevelCommentId: React.PropTypes.string, // if reply
  successCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
  cancelCallback: React.PropTypes.func
}

CommentNew.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentNew;