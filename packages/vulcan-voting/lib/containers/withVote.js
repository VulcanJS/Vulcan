import React, { PropTypes, Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { voteOptimisticResponse } from '../modules/vote.js';
import { VoteableCollections } from '../modules/make_voteable.js';

export const withVote = component => {

  return graphql(gql`
    mutation vote($documentId: String, $operationType: String, $collectionName: String, $voteId: String) {
      vote(documentId: $documentId, operationType: $operationType, collectionName: $collectionName, voteId: $voteId) {
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

        const voteId = Random.id();
        const newDocument = voteOptimisticResponse({collection, document, user: currentUser, operationType, voteId});

        return mutate({ 
          variables: {
            documentId: document._id, 
            operationType,
            collectionName: collection.options.collectionName,
            voteId,
          },
          optimisticResponse: {
            __typename: 'Mutation',
            vote: newDocument,
          }
        })
      }
    }),
  })(component);
}