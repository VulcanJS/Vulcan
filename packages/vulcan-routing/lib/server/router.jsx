import React from 'react';
import { match, RouterContext, createMemoryHistory } from 'react-router';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import moment from 'moment';
import { RoutePolicy } from 'meteor/routepolicy';

import { withRenderContextEnvironment, InjectData } from 'meteor/vulcan:lib';

function isAppUrl(req) {
  const url = req.url;
  if (url === '/favicon.ico' || url === '/robots.txt') {
    return false;
  }

  if (url === '/app.manifest') {
    return false;
  }

  // Avoid serving app HTML for declared routes such as /sockjs/.
  if (RoutePolicy.classify(url)) {
    return false;
  }

  // we only need to support HTML pages only for browsers
  // Facebook's scraper uses a request header Accepts: */*
  // so allow either
  const facebookAcceptsHeader = new RegExp('/*\/*/');
  return /html/.test(req.headers.accept) || facebookAcceptsHeader.test(req.headers.accept);
}

function generateSSRData(options, req, res, renderProps) {
  let html;
  let css;
  let styledComponentCss;

  try {
    req.css = '';

    renderProps = {
      ...renderProps,
      ...options.props,
    };

    const appGenerator = addProps => <RouterContext {...renderProps} {...addProps} />;

    let app;
    if (typeof options.wrapperHook === 'function') {
      app = options.wrapperHook(req, res, appGenerator);
    }

    if (options.preRender) {
      options.preRender(req, res, app);
    }

    if (!options.disableSSR) {
      const sheet = new ServerStyleSheet();
      html = renderToString(sheet.collectStyles(app));
      styledComponentCss = sheet.getStyleTags();
    } else if (options.loadingScreen) {
      html = options.loadingScreen;
    }

    if (typeof options.dehydrateHook === 'function') {
      const data = options.dehydrateHook(req, res);
      InjectData.pushData(res, 'dehydrated-initial-data', JSON.stringify(data));
    }

    // send server timezone to client
    InjectData.pushData(res, 'utcOffset', moment().utcOffset());

    if (options.postRender) {
      options.postRender(req, res);
    }

    css = req.css;
  } catch (err) {
    console.error(`Error while server-rendering. date: ${new Date().toString()} url: ${req.url}`); // eslint-disable-line no-console
    console.error(err); // eslint-disable-line no-console
  }

  return { html, css, styledComponentCss };
}

function sendSSRHtml(options, req, res, next, renderProps) {
  const { css, html, styledComponentCss } = generateSSRData(options, req, res, renderProps);

  req.dynamicHead = req.dynamicHead || '';
  req.dynamicBody = req.dynamicBody || '';

  // css declared in the project
  if (css) {
    req.dynamicHead += `<style id="${options.styleCollectorId || 'css-style-collector-data'}">${css}</style>`;
  }

  // css collected by styled-components
  if (styledComponentCss) {
    req.dynamicHead += styledComponentCss;
  }

  let rootElementAttributes = '';
  const attributes = options.rootElementAttributes instanceof Array ? options.rootElementAttributes : [];
  if (attributes[0] instanceof Array) {
    for (let i = 0; i < attributes.length; i++) {
      rootElementAttributes += ` ${attributes[i][0]}="${attributes[i][1]}"`;
    }
  } else if (attributes.length > 0) {
    rootElementAttributes = ` ${attributes[0]}="${attributes[1]}"`;
  }

  req.dynamicBody += `<${options.rootElementType || 'div'} id="${options.rootElement || 'react-app'}"${rootElementAttributes}>${html || ''}</${options.rootElementType || 'div'}>`;

  if (typeof options.htmlHook === 'function') {
    const { dynamicHead, dynamicBody } = options.htmlHook(req, res, req.dynamicHead, req.dynamicBody);
    req.dynamicHead = dynamicHead;
    req.dynamicBody = dynamicBody;
  }

  next();
}

export const RouterServer = {
  run(routes, options) {
    if (!options) {
      options = {};
    }

    withRenderContextEnvironment(function routerMiddleware(context, req, res, next) {
      if (!isAppUrl(req)) {
        next();
        return;
      }

      let history = createMemoryHistory(req.url);

      if (typeof options.historyHook === 'function') {
        history = options.historyHook(req, res, history);
      }

      match({ history, routes, location: req.url }, (err, redirectLocation, renderProps) => {
        if (err) {
          res.writeHead(500);
          res.write(err.messages);
          res.end();
        } else if (redirectLocation) {
          res.writeHead(302, { Location: redirectLocation.pathname + redirectLocation.search });
          res.end();
        } else if (renderProps) {
          sendSSRHtml(options, req, res, next, renderProps);
        } else {
          res.writeHead(404);
          res.write('Not found');
          res.end();
        }
      });
    }, { order: 800 });
  },
};
