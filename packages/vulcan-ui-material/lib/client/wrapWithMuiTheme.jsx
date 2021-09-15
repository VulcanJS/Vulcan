import React from 'react';
import { addCallback, Components } from 'meteor/vulcan:core';

function wrapWithMuiTheme(app, { apolloClient }) {
  return (
    <Components.StylesManager>
      <Components.ThemeProvider apolloClient={apolloClient}>{app}</Components.ThemeProvider>
    </Components.StylesManager>
  );
}

addCallback('router.client.wrapper', wrapWithMuiTheme);
