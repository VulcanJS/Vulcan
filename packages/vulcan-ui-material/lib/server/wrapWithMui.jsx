import React from 'react';
import { addCallback, Components } from 'meteor/vulcan:core';

// Setup SSR
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../modules/createEmotionCache';

// tss setup
import { getTssDefaultEmotionCache } from 'tss-react/cache';

// @see https://next.material-ui.com/guides/server-rendering/#main-content
function collectStyles(app, { context, apolloClient }) {
  const cache = createEmotionCache();
  context.cache = cache;
  const wrappedApp = (
    <CacheProvider value={cache}>
      <Components.StylesManager>
        <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
      </Components.StylesManager>
    </CacheProvider>
  );
  return wrappedApp;
}

/*
function wrapWithMuiTheme(app, { context, apolloClient }) {
  // LEGACY: this supports the old, deprecated "makeStyles" syntax
  // TODO: remove when all makeStyles are removed from the app
  // will spawn a StylesProvider automatically during render
  // replaces the manual setup of JSSProvider
  // @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-styles/src/ServerStyleSheets/ServerStyleSheets.js
  return (
    <Components.StylesManager disableGeneration={true}>
      <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
    </Components.StylesManager>
  );
}
*/

/*
function wrapWithMuiStyleGenerator(app, { context, apolloClient }) {
  return (
    <Components.StylesManager>
      <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
    </Components.StylesManager>
  );
}
*/
// only run during Apollo's data collection, will provide the theme but won't generate the styles
//addCallback('router.server.dataWrapper', wrapWithMuiTheme);
// only run during actual rendering, will both provide the theme and generate the styles
addCallback('router.server.wrapper', collectStyles);

addCallback('router.server.postRender', function appendStyleTags(sink, { context }) {
  const html = sink.body;
  const { cache } = context;
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
  // FIXME: chunks are empty, yet the cache is correctl filled
  const emotionChunks = extractCriticalToChunks(html);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);
  sink.appendToHead(emotionCss);
  // do the same for TSS react
  const tssEmotionServer = createEmotionServer(getTssDefaultEmotionCache());
  // @see https://github.com/garronej/tss-react
  const tssCss = tssEmotionServer.constructStyleTagsFromChunks(tssEmotionServer.extractCriticalToChunks(html));
  sink.appendToHead(tssCss);
  return sink;
});
