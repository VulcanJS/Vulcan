import { addTrackFunction } from 'meteor/vulcan:events';
import { getRenderContext } from 'meteor/vulcan:lib';
import gql from 'graphql-tag';

function trackInternal(eventName, eventProperties) {
  const { apolloClient } = getRenderContext();
  const mutation = gql`
    mutation AnalyticsEventsNew($document: AnalyticsEventsInput) {
      AnalyticsEventsNew(document: $document) {
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
