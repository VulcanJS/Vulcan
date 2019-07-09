import React from 'react';
import { addCallback } from 'meteor/vulcan:core';
import JssProvider from 'react-jss/lib/JssProvider';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createGenerateClassName from '@material-ui/core/styles/createGenerateClassName';
import { getCurrentTheme } from '../modules/themes';
import { SheetsRegistry } from 'react-jss/lib/jss';
import JssCleanup from '../components/theme/JssCleanup';

function wrapWithMuiTheme(app, { context }) {
  const sheetsManager = new Map();

  const theme = getCurrentTheme();

  return (
    <MuiThemeProvider theme={theme} sheetsManager={sheetsManager}>
      {app}
    </MuiThemeProvider>
  );
}

function wrapWithJSSProvider(app, { context }) {
  const sheetsRegistry = new SheetsRegistry();
  context.sheetsRegistry = sheetsRegistry;

  const generateClassName = createGenerateClassName({ seed: '' });

  return (
    <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
      <JssCleanup>{app}</JssCleanup>
    </JssProvider>
  );
}

function injectJss(sink, { context }) {
  const sheets = context.sheetsRegistry.toString();
  sink.appendToHead(`<style id="jss-server-side">${sheets}</style>`);
  return sink;
}

addCallback('router.server.wrapper', wrapWithMuiTheme);
addCallback('router.server.styleWrapper', wrapWithJSSProvider);
addCallback('router.server.postRender', injectJss);
