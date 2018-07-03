import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { performVoteClient } from '../modules/vote.js';
import { VoteableCollections } from '../modules/make_voteable.js';
import { getFragmentText } from 'meteor/vulcan:lib';

export const withVote = component => {

  return graphql(gql`
    mutation vote($documentId: String, $voteType: String, $collectionName: String, $voteId: String) {
      vote(documentId: $documentId, voteType: $voteType, collectionName: $collectionName, voteId: $voteId) {
        ${VoteableCollections.map(collection => `
          ... on ${collection.typeName} {
            ...WithVote${collection.typeName}
          }
        `).join('\n')}
      }
    }
    ${VoteableCollections.map(collection => `
      ${getFragmentText(`WithVote${collection.typeName}`)}
    `).join("\n")}
  `, {
    options: () => ({
      ssr: false
    }),
    props: ({ownProps, mutate}) => ({
      vote: ({document, voteType, collection, currentUser, voteId = Random.id()}) => {

        const newDocument = performVoteClient({collection, document, user: currentUser, voteType, voteId});

        return mutate({
          variables: {
            documentId: document._id,
            voteType,
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
