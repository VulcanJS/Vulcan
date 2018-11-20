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

// onPageLoad is mostly equivalent to an Express middleware
// excepts it is tailored to handle Meteor server side rendering
import { onPageLoad } from 'meteor/server-render'

import Html from './Html';
import Head from './Head'
import appGenerator from './appGenerator';

onPageLoad(async (sink) => {
  const req = sink.request
  // according to the Apollo doc, client needs to be recreated on every request
  // this avoids caching server side
  const client = createClient(req);
  // TODO adapt to Vulcan
  const context = {};

  const App = appGenerator({ req, client, context })

  // Alternative that relies on Meteor server-render:
  // @see https://github.com/szomolanyi/MeteorApolloStarter/blob/master/imports/startup/server/ssr.js

  // TODO: adapt to Vulcan
  // @see https://github.com/apollographql/GitHunt-React/blob/master/src/server.js
  // @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#renderToStringWithData
  // equivalent to calling getDataFromTree and then renderToStringWithData
  //sink.appendToBody(ReactDOM.renderToStaticMarkup(<div id='react-app'></div>))
  const content = await renderToStringWithData(App)
  console.log(content.slice(0,100))
  const wrappedContent = `<div id="react-app">${content}</div>`
  sink.appendToBody(wrappedContent)
  //sink.renderIntoElementById('react-app', 'HI')//content)
  // add headers
  const head = ReactDOM.renderToString(Head)
  sink.appendToHead(head)
  // add data
  const initialState = client.extract();
  sink.appendToBody(ReactDOM.renderToString(
    <script dangerouslySetInnerHTML={{
      __html: `window.__APOLLO_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')};`,
    }} />
    ))
})

const ssrMiddleware = (req, res) => {
  // according to the Apollo doc, client needs to be recreated on every request
  // this avoids caching server side
  const client = createClient(req);
  // TODO adapt to Vulcan
  const context = {};

  const App = appGenerator({ req, client, context })

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
