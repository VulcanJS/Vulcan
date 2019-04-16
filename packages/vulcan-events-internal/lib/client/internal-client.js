import { addTrackFunction } from 'meteor/vulcan:events';
import { getApolloClient, getFragment, createClientTemplate } from 'meteor/vulcan:lib';
import gql from 'graphql-tag';

function trackInternal(eventName, eventProperties) {
  const apolloClient = getApolloClient();

  const fragmentName = 'AnalyticsEventFragment';
  const fragment = getFragment(fragmentName);

  const mutation = gql`
    ${createClientTemplate({ typeName: 'AnalyticsEvent', fragmentName })}
    ${fragment}
  `;

  const variables = {
    data: {
      name: eventName,
      properties: eventProperties,
    },
  };
  apolloClient.mutate({ mutation, variables });
}

addTrackFunction(trackInternal);
