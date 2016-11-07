import React, { PropTypes, Component } from 'react';
import NovaForm from "meteor/nova:forms";
import Comments from "meteor/nova:comments";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const CommentsEditForm = (props, context) => {
  return (
    <div className="comments-edit-form">
      <NovaForm 
        layout="elementOnly"
        collection={Comments}
        document={props.comment}
        mutationName="commentsEdit"
        resultQuery={Comments.graphQLQueries.single}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        updateQueries={{
          getPost: (prev, { mutationResult }) => {

            const editedComment = mutationResult.data.commentsEdit;

            const commentIndex = Telescope.utils.findIndex(prev.post.comments, comment => comment._id = editedComment._id);
            const newCommentList = _.clone(prev.post.comments);
            newCommentList[commentIndex] = Object.assign(newCommentList[commentIndex], editedComment);
            
            const newPost = update(prev, {
              post: {
                comments: {
                  $set: newCommentList
                }
              }
            });

            return newPost;
          },
        }}
      />
    </div>
  )
}

CommentsEditForm.propTypes = {
  comment: React.PropTypes.object.isRequired,
  successCallback: React.PropTypes.func,
  cancelCallback: React.PropTypes.func
}

CommentsEditForm.contextTypes = {
  currentUser: React.PropTypes.object
}

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

module.exports = connect(mapStateToProps, mapDispatchToProps)(CommentsEditForm);
