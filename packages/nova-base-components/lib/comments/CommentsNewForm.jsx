import { Components, registerComponent, getRawComponent } from 'meteor/nova:core';
import React, { PropTypes, Component } from 'react';
import SmartForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";
import { ShowIf, withMessages } from 'meteor/nova:core';
import { FormattedMessage } from 'react-intl';

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
    <ShowIf
      check={Comments.options.mutations.new.check}
      failureComponent={<FormattedMessage id="users.cannot_comment"/>}
    >
      <div className="comments-new-form">
        <SmartForm
          collection={Comments}
          mutationFragment={getRawComponent('PostsCommentsThread').fragment}
          successCallback={props.successCallback} 
          cancelCallback={props.type === "reply" ? props.cancelCallback : null}
          prefilledProps={prefilledProps}
          layout="elementOnly"
        />
      </div>
    </ShowIf>
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
};

registerComponent('CommentsNewForm', CommentsNewForm, withMessages);
