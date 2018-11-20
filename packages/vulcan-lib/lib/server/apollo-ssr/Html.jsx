// TODO: adapt to Vulcan
// @see https://github.com/apollographql/GitHunt-React/blob/master/src/routes/Html.js
/* eslint-disable react/no-danger */

import React from 'react';
import { Helmet } from 'react-helmet'

const Head = () => {
// Helmet.rewind() is deprecated in favour of renderStatic() for better readability
//@see https://github.com/nfl/react-helmet/releases/tag/5.0.0
  const helmet = Helmet.renderStatic()
  return (
    <head>
      {helmet.title.toComponent()}
      {helmet.meta.toComponent()}
      {helmet.link.toComponent()}
    </head>
  )
}
// this render the page and add a script that will load the serialized data
const Html = ({ content, state }) => {
  return (
    <html>
      <Head />
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
        }} />
      </body>
    </html>
  );
}

export default Html;

// Previous implementation from router.js:
// Some code could be useful eg to handle CSS

//function sendSSRHtml(options, req, res, next, renderProps) {
//  const { css, html, styledComponentCss } = generateSSRData(options, req, res, renderProps);
//
//  req.dynamicHead = req.dynamicHead || '';
//  req.dynamicBody = req.dynamicBody || '';
//
//  // css declared in the project
//  if (css) {
//    req.dynamicHead += `<style id="${options.styleCollectorId || 'css-style-collector-data'}">${css}</style>`;
//  }
//
//  // css collected by styled-components
//  if (styledComponentCss) {
//    req.dynamicHead += styledComponentCss;
//  }
//
//  let rootElementAttributes = '';
//  const attributes = options.rootElementAttributes instanceof Array ? options.rootElementAttributes : [];
//  if (attributes[0] instanceof Array) {
//    for (let i = 0; i < attributes.length; i++) {
//      rootElementAttributes += ` ${attributes[i][0]}="${attributes[i][1]}"`;
//    }
//  } else if (attributes.length > 0) {
//    rootElementAttributes = ` ${attributes[0]}="${attributes[1]}"`;
//  }
//
//  req.dynamicBody += `<${options.rootElementType || 'div'} id="${options.rootElement || 'react-app'}"${rootElementAttributes}>${html || ''}</${options.rootElementType || 'div'}>`;
//
//  if (typeof options.htmlHook === 'function') {
//    const { dynamicHead, dynamicBody } = options.htmlHook(req, res, req.dynamicHead, req.dynamicBody);
//    req.dynamicHead = dynamicHead;
//    req.dynamicBody = dynamicBody;
//  }
//
//  next();
//}