import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Comments from "meteor/vulcan:comments";
import { FormattedMessage } from 'meteor/vulcan:i18n';

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
    <Components.ShowIf
      check={Comments.options.mutations.new.check}
      failureComponent={<FormattedMessage id="users.cannot_comment"/>}
    >
      <div className="comments-new-form">
        <Components.SmartForm
          collection={Comments}
          mutationFragment={getFragment('CommentsList')}
          successCallback={props.successCallback} 
          cancelCallback={props.type === "reply" ? props.cancelCallback : null}
          prefilledProps={prefilledProps}
          layout="elementOnly"
        />
      </div>
    </Components.ShowIf>
  )

};

CommentsNewForm.propTypes = {
  postId: PropTypes.string.isRequired,
  type: PropTypes.string, // "comment" or "reply"
  parentComment: PropTypes.object, // if reply, the comment being replied to
  parentCommentId: PropTypes.string, // if reply
  topLevelCommentId: PropTypes.string, // if reply
  successCallback: PropTypes.func, // a callback to execute when the submission has been successful
  cancelCallback: PropTypes.func,
  router: PropTypes.object,
  flash: PropTypes.func,
};

registerComponent('CommentsNewForm', CommentsNewForm, withMessages);
