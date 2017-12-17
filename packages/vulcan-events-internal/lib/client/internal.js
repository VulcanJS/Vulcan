import { addTrackFunction } from 'meteor/vulcan:events';
import { ApolloClient } from 'apollo-client';
import { getRenderContext } from 'meteor/vulcan:lib';
import gql from 'graphql-tag';

function trackInternal() {
  const { apolloClient, store } = getRenderContext();
  console.log(apolloClient)
  apolloClient.query({ query: gql`{ hello }` }).then(console.log);
}

addTrackFunction(trackInternal);
