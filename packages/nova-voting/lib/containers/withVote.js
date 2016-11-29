import Telescope from 'meteor/nova:lib';
import Posts from 'meteor/nova:posts';
import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

// to adapt like withNew? or withSingle?
export default function withVote(component) {
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