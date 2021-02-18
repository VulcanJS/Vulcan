import React from 'react';
import { addCallback, Components } from 'meteor/vulcan:core';
import { ServerStyleSheets } from '@material-ui/core/styles';

function wrapWithMuiTheme(app, { context, apolloClient }) {
  // will spawn a StylesProvider automatically during render
  // replaces the manual setup of JSSProvider
  // @see https://github.com/mui-org/material-ui/blob/master/packages/material-ui-styles/src/ServerStyleSheets/ServerStyleSheets.js
  const sheets = new ServerStyleSheets({ disableGeneration: true });
  context.sheetsRegistry = sheets;

  return sheets.collect(
    <Components.ThemeProvider apolloClient={apolloClient} context={context}>
      {app}
    </Components.ThemeProvider>
  );
}

function wrapWithMuiStyleGenerator(app, { context, apolloClient }) {
  const sheets = new ServerStyleSheets();
  context.sheetsRegistry = sheets;

  // NOTE: The sheets.collect API does not allow to pass a seed
  // do we still need to force a specific seed?
  // if yes reenable this code and create the StylesProvider manually as we
  // used to do for JSSProvider
  //const generateClassName = createGenerateClassName({ seed: '' });

  return sheets.collect(
    <Components.ThemeProvider apolloClient={apolloClient} context={context}>
      {app}
    </Components.ThemeProvider>
  );
}

function injectJss(sink, { context }) {
  const sheets = context.sheetsRegistry.toString();
  sink.appendToHead(`<style id="jss-server-side">${sheets}</style>`);
  return sink;
}

// only run during Apollo's data collection, will provide the theme but won't generate the styles
addCallback('router.server.dataWrapper', wrapWithMuiTheme);
// only run during actual rendering, will both provide the theme and generate the styles
addCallback('router.server.renderWrapper', wrapWithMuiStyleGenerator);

// inject the <style> tag after rendering
addCallback('router.server.postRender', injectJss);
