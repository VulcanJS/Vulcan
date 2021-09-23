import React from 'react';
// Setup SSR
import { addCallback } from 'meteor/vulcan:core';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../modules/createEmotionCache';

// tss setup
import { getTssDefaultEmotionCache } from 'tss-react/cache';

// @see https://next.material-ui.com/guides/server-rendering/#main-content
const setupEmotion = () => {
  // NOTE: this doesn't work with server.renderWrapper
  addCallback('router.server.wrapper', function collectStyles(app, { context }) {
    const cache = createEmotionCache();
    context.cache = cache;
    const wrappedApp = <CacheProvider value={cache}>{app}</CacheProvider>;
    return wrappedApp;
  });

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
};

export default setupEmotion;
