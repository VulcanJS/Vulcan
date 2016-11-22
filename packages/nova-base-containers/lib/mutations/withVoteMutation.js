import Telescope from 'meteor/nova:lib';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// to be moved in nova:voting
// Telescope.graphQL.addMutation('postsVote(documentId: String, voteType: String) : Post');
// postsVote(root, {documentId, voteType}, context) {
//   Meteor._sleepForMs(2000); // wait 2 seconds for demonstration purpose
//   console.log("sleep done");
//   const post = Posts.findOne(documentId);
//   return context.Users.canDo(context.currentUser, `posts.${voteType}`) ? Telescope.operateOnItem(context.Posts, post, context.currentUser, voteType) : false;
// },

export default function withVoteMutation (component, options) {
  return graphql(gql`
    mutation postsVote($documentId: String, $voteType: String) {
      postsVote(documentId: $documentId, voteType: $voteType) {
        _id
        baseScore
        downvotes
        downvoters {
          _id
        }
        upvotes
        upvoters {
          _id
        }
      }
    }
  `, {
    props: ({ownProps, mutate}) => ({
      vote: ({post, voteType, currentUser}) => {
        const votedItem = Telescope.operateOnItem(Posts, post, currentUser, voteType, true);
        return mutate({ 
          variables: {documentId: post._id, voteType},
          optimisticResponse: {
            __typename: 'Mutation',
            postsVote: {
              ...votedItem,
            },
          }
        })
      }
    }),
  })(component);
}