/**
 * Render the page server side
 * @see https://github.com/szomolanyi/MeteorApolloStarter/blob/master/imports/startup/server/ssr.js
 * @see https://github.com/apollographql/GitHunt-React/blob/master/src/server.js
 * @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#renderToStringWithData
 */
import React from 'react';
import ReactDOM from 'react-dom/server';
import { renderToStringWithData } from 'react-apollo';

import { runCallbacks } from '../../modules/callbacks'
import { createClient } from './apolloClient';

import Head from './components/Head'
import ApolloState from './components/ApolloState'
import AppGenerator from './components/AppGenerator';

const makePageRenderer = ({ computeContext }) => {
    // onPageLoad callback
    const renderPage = async sink => {
        const req = sink.request
        // according to the Apollo doc, client needs to be recreated on every request
        // this avoids caching server side
        const client = await createClient({req, computeContext});

        // TODO? do we need this?
        const context = {};


        // TODO: req object does not seem to have been processed by the Express 
        // middlewares at this point
        // @see https://github.com/meteor/meteor-feature-requests/issues/174#issuecomment-441047495

        // equivalent to calling getDataFromTree and then renderToStringWithData
        const content = await renderToStringWithData(
            <AppGenerator req={req} client={client} context={context} />
        )

        // TODO: there should be a cleaner way to set this wrapper
        // id must always match the client side start.jsx file
        const wrappedContent = `<div id="react-app">${content}</div>`
        sink.appendToBody(wrappedContent)
        // TODO: this sounds cleaner but where do we add the <div id="react-app"> ?
        //sink.renderIntoElementById('react-app', content)

        // add headers using helmet
        const head = ReactDOM.renderToString(<Head />)
        sink.appendToHead(head)

        // add Apollo state, the client will then parse the string
        const initialState = client.extract();
        const serializedApolloState = ReactDOM.renderToString(
            <ApolloState initialState={initialState} />
        )
        sink.appendToBody(serializedApolloState)
        runCallbacks({
            name: 'router.server.postRender',
            iterator: sink,
            properties: { context }
        });
    }
    return renderPage
}

export default makePageRenderer
// FIRST TRY WITH EXPRESS
// However this won't work as Meteor is in charge of loading relevant JS script
// This code would only render dead HTML
// Could be useful for SEO though or if we switch away from Meteor
//const ssrMiddleware = (req, res) => {
//  // according to the Apollo doc, client needs to be recreated on every request
//  // this avoids caching server side
//  const client = createClient(req);
//  // TODO adapt to Vulcan
//  const context = {};
//
//  const App = appGenerator({ req, client, context })
//
//  // Alternative that relies on Meteor server-render:
//  // @see https://github.com/szomolanyi/MeteorApolloStarter/blob/master/imports/startup/server/ssr.js
//
//  // TODO: adapt to Vulcan
//  // @see https://github.com/apollographql/GitHunt-React/blob/master/src/server.js
//  // @see https://www.apollographql.com/docs/react/features/server-side-rendering.html#renderToStringWithData
//  renderToStringWithData(App)
//    .then(content => {
//      const initialState = client.extract();
//      const html = <Html content={content} state={initialState} />;
//      //const html = <Html content={content} client={client} />;
//      res.statusCode = 200;
//      //res.status(200);
//      res.end(`<!doctype html>\n${ReactDOM.renderToStaticMarkup(html)}`, 'utf8');
//      //res.end();
//    })
//    .catch(e => {
//      console.error('RENDERING ERROR:', e); // eslint-disable-line no-console
//      res.statusCode = 500;
//      res.end(`An error occurred. Stack trace:\n\n${e.stack}`);
//    });
//
//  // TODO here we actually render with context (see render_context)
//};
// export default ssrMiddleware;