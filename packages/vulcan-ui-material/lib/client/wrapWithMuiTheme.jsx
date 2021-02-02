import React from 'react';
import { addCallback, Components } from 'meteor/vulcan:core';

function wrapWithMuiTheme(app, { apolloClient }) {
  return <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>;
}

addCallback('router.client.wrapper', wrapWithMuiTheme);
