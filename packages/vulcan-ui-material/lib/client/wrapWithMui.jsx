import React from 'react';
import { addCallback, Components } from 'meteor/vulcan:core';

import createEmotionCache from '../modules/createEmotionCache';
import { CacheProvider } from '@emotion/react';
const cache = createEmotionCache();

function wrapWithMuiTheme(app, { apolloClient }) {
  return (
    <CacheProvider value={cache}>
      <Components.StylesManager>
        <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
      </Components.StylesManager>
    </CacheProvider>
  );
}

addCallback('router.client.wrapper', wrapWithMuiTheme);
