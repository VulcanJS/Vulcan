import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";

const CommentsNewForm = (props, context) => {

  let prefilledProps = {postId: props.postId};

  if (props.parentComment) {
    prefilledProps = Object.assign(prefilledProps, {
      parentCommentId: props.parentComment._id,
      // if parent comment has a topLevelCommentId use it; if it doesn't then it *is* the top level comment
      topLevelCommentId: props.parentComment.topLevelCommentId || props.parentComment._id
    });
  }

  return (
    <Telescope.components.CanDo
      action="comments.new"
      noPermissionMessage="users.cannot_comment"
      displayNoPermissionMessage={true}
    >
      <div className="comments-new-form">
        <NovaForm 
          collection={Comments} 
          novaFormMutation={props.novaFormMutation}
          prefilledProps={prefilledProps}
          //successCallback={props.successCallback}
          layout="elementOnly"
          cancelCallback={props.type === "reply" ? props.cancelCallback : null}
        />
      </div>
    </Telescope.components.CanDo>
  )

};

CommentsNewForm.propTypes = {
  postId: React.PropTypes.string.isRequired,
  type: React.PropTypes.string, // "comment" or "reply"
  parentComment: React.PropTypes.object, // if reply, the comment being replied to
  parentCommentId: React.PropTypes.string, // if reply
  topLevelCommentId: React.PropTypes.string, // if reply
  successCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
  cancelCallback: React.PropTypes.func,
  novaFormMutation: React.PropTypes.func,
  router: React.PropTypes.object,
  flash: React.PropTypes.func,
}

CommentsNewForm.contextTypes = {
  currentUser: React.PropTypes.object
}

module.exports = CommentsNewForm;