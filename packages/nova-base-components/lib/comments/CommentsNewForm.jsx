import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import update from 'immutability-helper';

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
          mutationName="commentsNew"
          // fragment={Comments.fragments.list}
          updateQueries={{
            getPost: (prev, { mutationResult }) => {
              // console.log('[commentsNew] prev post', prev)
              const newPost = update(prev, {
                post: {
                  commentCount: {
                    $set: prev.post.commentCount + 1
                  }
                }
              });
              // console.log('[commentsNew] new post', newPost)
              return newPost;
            },
            getCommentsList: (prev, { mutationResult }) => {
              // console.log('[commentsNew] previous comment list', prev);
              const newComment = mutationResult.data.commentsNew;
              const newCommentsList = update(prev, {
                commentsList: {
                  $push: [newComment]
                },
                commentsListTotal: {
                  $set: prev.commentsListTotal + 1
                },
              });
              // console.log('[commentsNew] new comment list', newCommentsList)
              return newCommentsList;
            },
          }}
          successCallback={props.successCallback} 
          cancelCallback={props.type === "reply" ? props.cancelCallback : null}
          prefilledProps={prefilledProps}
          layout="elementOnly"
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
};

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

Telescope.registerComponent('CommentsNewForm', CommentsNewForm, connect(mapStateToProps, mapDispatchToProps));
