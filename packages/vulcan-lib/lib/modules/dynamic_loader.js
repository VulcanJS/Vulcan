import React from 'react';
import loadable from 'react-loadable';
import { Components } from './components.js';

export const dynamicLoader = componentImport => loadable({
  loader: () => componentImport,
  loading: Components.DynamicLoading,
  // serverSideRequirePath: adminPath
});

export const getDynamicComponent = componentImport => React.createElement(dynamicLoader(componentImport));