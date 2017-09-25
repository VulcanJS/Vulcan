import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { voteOnItem } from '../modules/vote.js';
import { VoteableCollections } from '../modules/make_voteable.js';

const withVote = component => {

  return graphql(gql`
    mutation vote($documentId: String, $operationType: String, $collectionName: String) {
      vote(documentId: $documentId, operationType: $operationType, collectionName: $collectionName) {
        ${VoteableCollections.map(collection => `
          ... on ${collection.typeName} {
            __typename
            _id
            currentUserVotes{
              _id
              voteType
              power
            }
            baseScore
          }
        `).join('\n')}
      }
    }
  `, {
    props: ({ownProps, mutate}) => ({
      vote: ({document, operationType, collection, currentUser}) => {

        const voteResult = voteOnItem(collection, document, currentUser, operationType, true);

        return mutate({ 
          variables: {
            documentId: document._id, 
            operationType,
            collectionName: collection._name,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            vote: voteResult.document,
          }
        })
      }
    }),
  })(component);
}

export default withVote;