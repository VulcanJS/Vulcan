/**
 * Server-side Apollo client
 *
 *
 * @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#server-initialization
 */

// This example uses React Router v4, although it should work
// equally well with other routers that support SSR

import { renderToStringWithData } from 'react-apollo';

import createClient from './createClient';

import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './Html';
import appGenerator from './appGenerator';

const ssrMiddleware = (req, res) => {
  // according to the Apollo doc, client needs to be recreated on every request
  // this avoids caching server side
  const client = createClient(req);
  // TODO adapt to Vulcan
  const context = {};

  const App = appGenerator({req, client, context})

  // Alternative that relies on Meteor server-render:
  // @see https://github.com/szomolanyi/MeteorApolloStarter/blob/master/imports/startup/server/ssr.js

  // TODO: adapt to Vulcan
  // @see https://github.com/apollographql/GitHunt-React/blob/master/src/server.js
  // @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#renderToStringWithData
  renderToStringWithData(App)
    .then(content => {
      const initialState = client.extract();
      const html = <Html content={content} state={initialState} />;
      //const html = <Html content={content} client={client} />;
      res.statusCode = 200;
      //res.status(200);
      res.end(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`, 'utf8');
      //res.end();
    })
    .catch(e => {
      console.error('RENDERING ERROR:', e); // eslint-disable-line no-console
      res.statusCode = 500;
      res.end(`An error occurred. Stack trace:\n\n${e.stack}`);
    });

  // TODO here we actually render with context (see render_context)
};
export default ssrMiddleware;
