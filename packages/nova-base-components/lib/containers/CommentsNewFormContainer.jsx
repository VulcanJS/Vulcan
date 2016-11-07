import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NovaForm from "meteor/nova:forms";
import { withRouter } from 'react-router'
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import update from 'immutability-helper';

const CommentsNewFormContainer = (props, context) => {
  const Component = props.component;

  return <Component {...props} />
}

CommentsNewFormContainer.propTypes = {
  router: React.PropTypes.object,
  novaFormMutation: React.PropTypes.func,
  component: React.PropTypes.func,
  postId: React.PropTypes.string.isRequired,
  type: React.PropTypes.string, // "comment" or "reply"
  parentComment: React.PropTypes.object, // if reply, the comment being replied to
  parentCommentId: React.PropTypes.string, // if reply
  topLevelCommentId: React.PropTypes.string, // if reply
  successCallback: React.PropTypes.func, // a callback to execute when the submission has been successful
  cancelCallback: React.PropTypes.func,
};

CommentsNewFormContainer.displayName = "CommentsNewFormContainer";

const mapStateToProps = state => ({ messages: state.messages });
const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

const CommentsNewFormContainerWithMutation = graphql(gql`
  mutation commentsNew($comment: CommentInput) {
    commentsNew(comment: $comment) {
      _id
      postId
      parentCommentId
      topLevelCommentId
      htmlBody
      postedAt
      user {
        _id
        telescope {
          slug
          emailHash # used for the avatar
        }
      }
    }
  }
`, {
  props: ({ownProps, mutate}) => ({
    novaFormMutation: ({document}) => {
      // const optimisticResponseItem = {
      //   ...document,
      //   title: "optimisitc!",
      //   __typename: 'Post',
      //   id: 123,
      //   slug: 'foo'
      // }

      // console.log(document)
      // console.log(optimisticResponseItem)

      return mutate({ 
        variables: {comment: document},
        // optimisticResponse: {
        //   __typename: 'Mutation',
        //   postsNew: optimisticResponseItem,
        // },
        updateQueries: {
          getPost: (prev, { mutationResult }) => {
            console.log(prev)
            console.log(mutationResult)
            const newComment = mutationResult.data.commentsNew;
            const newPost = update(prev, {
              post: {
                commentCount: {
                  $set: prev.post.commentCount + 1
                },
                comments: {
                  $push: [newComment]
                }
              }
            });
            console.log(newPost)
            return newPost;
          },
        }
      })
    }
  }),
})(CommentsNewFormContainer);

module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentsNewFormContainerWithMutation));
