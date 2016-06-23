import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";

class CommentsNew extends Component {

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
      <div className="comments-new-form">
        <NovaForm 
          collection={Comments} 
          currentUser={this.context.currentUser}
          methodName="comments.new"
          prefilledProps={prefilledProps}
          successCallback={this.props.successCallback}
          layout="elementOnly"
          cancelCallback={this.props.type === "reply" ? this.props.cancelCallback : null}
        />
      </div>
    )
  }

};

CommentsNew.propTypes = {
  postId: React.PropTypes.string.isRequired,
  type: React.PropTypes.string, // "comment" or "reply"
  parentComment: React.PropTypes.object, // if reply, the comment being replied to
  parentCommentId: React.PropTypes.string, // if reply
  topLevelCommentId: React.PropTypes.string, // if reply
  successCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
  cancelCallback: React.PropTypes.func
}

CommentsNew.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentsNew;