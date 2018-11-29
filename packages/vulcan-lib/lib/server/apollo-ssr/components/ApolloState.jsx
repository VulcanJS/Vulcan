/**
 * Component that serialize the Apollo client state
 * 
 * The client can then deserialize it and avoid unecessary requests
 */
import React from 'react';

const ApolloState = ({ initialState }) => (
  <script
    dangerouslySetInnerHTML={{
      __html: `window.__APOLLO_STATE__ = ${JSON.stringify(initialState).replace(
        /</g,
        '\\u003c'
      )};`
    }}
  />
);
export default ApolloState;
