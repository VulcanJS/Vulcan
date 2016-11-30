import React from 'react';

import {
  match as ReactRouterMatch,
  RouterContext,
  createMemoryHistory
} from 'react-router';

import SsrContext from './ssr_context';
import patchSubscribeData from './ssr_data';

import ReactDOMServer from 'react-dom/server';
import cookieParser from 'cookie-parser';
import Cheerio from 'cheerio';

function IsAppUrl(req) {
  var url = req.url;
  if(url === '/favicon.ico' || url === '/robots.txt') {
    return false;
  }

  if(url === '/app.manifest') {
    return false;
  }

  // Avoid serving app HTML for declared routes such as /sockjs/.
  if(RoutePolicy.classify(url)) {
    return false;
  }
  return true;
}

let webpackStats;

const ReactRouterSSR = {};
export default ReactRouterSSR;

// creating some EnvironmentVariables that will be used later on
ReactRouterSSR.ssrContext = new Meteor.EnvironmentVariable();
ReactRouterSSR.inSubscription = new Meteor.EnvironmentVariable(); // <-- needed in ssr_data.js

ReactRouterSSR.LoadWebpackStats = function(stats) {
  webpackStats = stats;
};

ReactRouterSSR.Run = function(routes, clientOptions, serverOptions) {
  // this line just patches Subscribe and find mechanisms
  patchSubscribeData(ReactRouterSSR);

  if (!clientOptions) {
    clientOptions = {};
  }

  if (!serverOptions) {
    serverOptions = {};
  }

  if (!serverOptions.webpackStats) {
    serverOptions.webpackStats = webpackStats;
  }

  Meteor.bindEnvironment(function() {
    WebApp.rawConnectHandlers.use(cookieParser());

    WebApp.connectHandlers.use(Meteor.bindEnvironment(function(req, res, next) {
      if (!IsAppUrl(req)) {
        next();
        return;
      }

      global.__CHUNK_COLLECTOR__ = [];

      var loginToken = req.cookies['meteor_login_token'];
      var headers = req.headers;
      var context = new FastRender._Context(loginToken, { headers });


      FastRender.frContext.withValue(context, function() {
        let history = createMemoryHistory(req.url);

        if (typeof serverOptions.historyHook === 'function') {
          history = serverOptions.historyHook(history);
        }

        ReactRouterMatch({ history, routes, location: req.url }, Meteor.bindEnvironment((err, redirectLocation, renderProps) => {
          if (err) {
            res.writeHead(500);
            res.write(err.messages);
            res.end();
          } else if (redirectLocation) {
            res.writeHead(302, { Location: redirectLocation.pathname + redirectLocation.search });
            res.end();
          } else if (renderProps) {
            sendSSRHtml(clientOptions, serverOptions, req, res, next, renderProps);
          } else {
            res.writeHead(404);
            res.write('Not found');
            res.end();
          }
        }));
      });
    }));
  })();
};

function sendSSRHtml(clientOptions, serverOptions, req, res, next, renderProps) {
  const { css, html } = generateSSRData(clientOptions, serverOptions, req, res, renderProps);
  res.write = patchResWrite(clientOptions, serverOptions, res.write, css, html);

  next();
}

function patchResWrite(clientOptions, serverOptions, originalWrite, css, html) {
  return function(data) {
    if(typeof data === 'string' && data.indexOf('<!DOCTYPE html>') === 0) {
      if (!serverOptions.dontMoveScripts) {
        data = moveScripts(data);
      }

      if (css) {
        data = data.replace('</head>', '<style id="' + (clientOptions.styleCollectorId || 'css-style-collector-data') + '">' + css + '</style></head>');
      }

      if (typeof serverOptions.htmlHook === 'function') {
        data = serverOptions.htmlHook(data);
      }

      let rootElementAttributes = '';
      const attributes = clientOptions.rootElementAttributes instanceof Array ? clientOptions.rootElementAttributes : [];
      if(attributes[0] instanceof Array) {
        for(var i = 0; i < attributes.length; i++) {
          rootElementAttributes = rootElementAttributes + ' ' + attributes[i][0] + '="' + attributes[i][1] + '"';
        }
      } else if (attributes.length > 0){
        rootElementAttributes = ' ' + attributes[0] + '="' + attributes[1] + '"';
      }

      data = data.replace('<body>', '<body><' + (clientOptions.rootElementType || 'div') + ' id="' + (clientOptions.rootElement || 'react-app') + '"' + rootElementAttributes + '>' + html + '</' + (clientOptions.rootElementType || 'div') + '>');

      if (typeof serverOptions.webpackStats !== 'undefined') {
        data = addAssetsChunks(serverOptions, data);
      }
    }

    originalWrite.call(this, data);
  };
}

function addAssetsChunks(serverOptions, data) {
  const chunkNames = serverOptions.webpackStats.assetsByChunkName;
  const publicPath = serverOptions.webpackStats.publicPath;

  if (typeof chunkNames.common !== 'undefined') {
    var chunkSrc = (typeof chunkNames.common === 'string')?
      chunkNames.common :
      chunkNames.common[0];

    data = data.replace('<head>', '<head><script type="text/javascript" src="' + publicPath + chunkSrc + '"></script>');
  }

  for (var i = 0; i < global.__CHUNK_COLLECTOR__.length; ++i) {
    if (typeof chunkNames[global.__CHUNK_COLLECTOR__[i]] !== 'undefined') {
      chunkSrc = (typeof chunkNames[global.__CHUNK_COLLECTOR__[i]] === 'string')?
        chunkNames[global.__CHUNK_COLLECTOR__[i]] :
        chunkNames[global.__CHUNK_COLLECTOR__[i]][0];

      data = data.replace('</head>', '<script type="text/javascript" src="' + publicPath + chunkSrc + '"></script></head>');
    }
  }

  return data;
}

function generateSSRData(clientOptions, serverOptions, req, res, renderProps) {
  let html, css;

  // we're stealing all the code from FlowRouter SSR
  // https://github.com/kadirahq/flow-router/blob/ssr/server/route.js#L61
  const ssrContext = new SsrContext();

  ReactRouterSSR.ssrContext.withValue(ssrContext, () => {
    try {
      const frData = InjectData.getData(res, 'fast-render-data');
      if (frData) {
        ssrContext.addData(frData.collectionData);
      }
      if (serverOptions.preRender) {
        serverOptions.preRender(req, res);
      }

      // Uncomment these two lines if you want to easily trigger
      // multiple client requests from different browsers at the same time

      // console.log('sarted sleeping');
      // Meteor._sleepForMs(5000);
      // console.log('ended sleeping');

      global.__STYLE_COLLECTOR_MODULES__ = [];
      global.__STYLE_COLLECTOR__ = '';

      renderProps = {
        ...renderProps,
        ...serverOptions.props
      };

      fetchComponentData(serverOptions, renderProps);
      let app = <RouterContext {...renderProps} />;

      if (typeof clientOptions.wrapperHook === 'function') {
        app = clientOptions.wrapperHook(app);
      }

      if (!serverOptions.disableSSR){
        html = ReactDOMServer.renderToString(app);
      } else if (serverOptions.loadingScreen){
        html = serverOptions.loadingScreen;
      }

      css = global.__STYLE_COLLECTOR__;

      if (typeof serverOptions.dehydrateHook === 'function') {
        InjectData.pushData(res, 'dehydrated-initial-data', JSON.stringify(serverOptions.dehydrateHook()));
      }

      if (serverOptions.postRender) {
        serverOptions.postRender(req, res);
      }

      // I'm pretty sure this could be avoided in a more elegant way?
      const context = FastRender.frContext.get();
      const data = context.getData();
      InjectData.pushData(res, 'fast-render-data', data);
    }
    catch(err) {
      console.error(new Date(), 'error while server-rendering', err.stack);
    }
  });
  return { html, css };
}

function fetchComponentData(serverOptions, renderProps) {
  const componentsWithFetch = renderProps.components
    .filter(component => !!component)
    .filter(component => component.fetchData);

  if (!componentsWithFetch.length) {
    return;
  }

  if (!Package.promise) {
    console.error("react-router-ssr: Support for fetchData() static methods on route components requires the 'promise' package.");
    return;
  }

  const promises = serverOptions.fetchDataHook(componentsWithFetch);
  Promise.awaitAll(promises);
}

function moveScripts(data) {
  const $ = Cheerio.load(data, {
    decodeEntities: false
  });
  const heads = $('head script');
  $('body').append(heads);
  $('head').html($('head').html().replace(/(^[ \t]*\n)/gm, ''));

  return $.html();
}
