// import Telescope from 'meteor/nova:lib';
// import React, { PropTypes, Component } from 'react';
// import { FormattedMessage, intlShape } from 'react-intl';

// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { withRouter } from 'react-router'
// import { graphql } from 'react-apollo';
// import gql from 'graphql-tag';
// import update from 'immutability-helper';

// const CommentsEditFormContainer = (props, context) => {
//   const Component = props.component;

//   return <Component {...props} />;
// };

// CommentsEditFormContainer.propTypes = {
//   flash: React.PropTypes.func,
//   novaFormMutation: React.PropTypes.func,
//   comment: React.PropTypes.object.isRequired,
//   router: React.PropTypes.object,
//   component: React.PropTypes.func,
//   successCallback: React.PropTypes.func,
//   cancelCallback: React.PropTypes.func,
// };

// const mapStateToProps = state => ({ messages: state.messages, });
// const mapDispatchToProps = dispatch => bindActionCreators(Telescope.actions.messages, dispatch);

// const CommentsEditFormContainerWithMutation = graphql(gql`
//   mutation commentsEdit($commentId: String, $set: CommentInput, $unset: CommentUnsetModifier) {
//     commentsEdit(commentId: $commentId, set: $set, unset: $unset) {
//       _id
//       body
//       htmlBody
//     }
//   }
// `, {
//   props: ({ownProps, mutate}) => ({
//     novaFormMutation: ({documentId, set, unset}) => {
//       return mutate({ 
//         variables: {commentId: documentId, set, unset},
//         // optimisticResponse: {
//         //   __typename: 'Mutation',
//         //   postsEdit: {
//         //     __typename: 'Post',
//         //     ...set
//         //   }
//         // },
//         updateQueries: {
//           getPost: (prev, { mutationResult }) => {

//             const editedComment = mutationResult.data.commentsEdit;

//             const commentIndex = Telescope.utils.findIndex(prev.post.comments, comment => comment._id = editedComment._id);
//             const newCommentList = _.clone(prev.post.comments);
//             newCommentList[commentIndex] = Object.assign(newCommentList[commentIndex], editedComment);
            
//             const newPost = update(prev, {
//               post: {
//                 comments: {
//                   $set: newCommentList
//                 }
//               }
//             });

//             return newPost;
//           },
//         }
//       })
//     }
//   }),
// })(CommentsEditFormContainer);

// module.exports = withRouter(connect(mapStateToProps, mapDispatchToProps)(CommentsEditFormContainerWithMutation));