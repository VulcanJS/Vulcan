import React from 'react';
// Setup SSR
import { addCallback } from 'meteor/vulcan:core';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../modules/createEmotionCache';

// @see https://next.material-ui.com/guides/server-rendering/#main-content
const setupEmotion = () => {
  addCallback('router.server.renderWrapper', function collectStyles(app, { context }) {
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);
    context.extractCriticalToChunks = extractCriticalToChunks;
    context.constructStyleTagsFromChunks = constructStyleTagsFromChunks;
    const wrappedApp = <CacheProvider value={cache}>{app}</CacheProvider>;
    return wrappedApp;
  });

  addCallback('router.server.postRender', function appendStyleTags(sink, { context }) {
    const emotionChunks = context.extractCriticalToChunks(sink.body);
    const emotionCss = context.constructStyleTagsFromChunks(emotionChunks);
    sink.appendToHead(emotionCss);
    return sink;
  });
};

export default setupEmotion;
