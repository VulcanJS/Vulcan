import React from 'react';
import { addCallback } from 'meteor/vulcan:core';

import createEmotionCache from '../modules/createEmotionCache';

import { CacheProvider } from '@emotion/react';

const cache = createEmotionCache();

function setupEmotion(app, { apolloClient }) {
  return <CacheProvider value={cache}>{app}</CacheProvider>;
}
addCallback('router.client.wrapper', setupEmotion);
