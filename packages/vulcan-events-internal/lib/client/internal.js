import { addTrackFunction } from 'meteor/vulcan:events';
import { ApolloClient } from 'apollo-client';
import { getRenderContext } from 'meteor/vulcan:lib';
import gql from 'graphql-tag';

function trackInternal(eventName, eventProperties) {
  const { apolloClient, store } = getRenderContext();
  const mutation = gql`
    mutation EventsNew($document: EventsInput) {
      EventsNew(document: $document) {
        name
        createdAt
      }
    }
  `;
  const variables = {
    document: {
      name: eventName,
      properties: eventProperties,
    },
  };
  apolloClient.mutate({ mutation, variables });
}

addTrackFunction(trackInternal);
