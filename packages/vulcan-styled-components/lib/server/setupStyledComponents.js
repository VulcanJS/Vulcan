// Setup SSR
import { ServerStyleSheet } from 'styled-components';
import { addCallback } from 'meteor/vulcan:core';

const setupStyledComponents = () => {
  addCallback('router.server.renderWrapper', function collectStyles(app, { context }) {
    const stylesheet = new ServerStyleSheet();
    // @see https://www.styled-components.com/docs/advanced/#example
    const wrappedApp = stylesheet.collectStyles(app);
    // store the stylesheet to reuse it later
    context.stylesheet = stylesheet;
    return wrappedApp;
  });

  addCallback('router.server.postRender', function appendStyleTags(sink, { context }) {
    sink.appendToHead(context.stylesheet.getStyleTags());
    return sink;
  });
};

export default setupStyledComponents;
