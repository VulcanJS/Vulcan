import React from 'react';
import loadable from 'react-loadable';
import isFunction from 'lodash/isFunction';
import { delayedComponent } from './components';

/**
 * @callback dynamicLoader~importComponent
 * @return {Promise<React.Component>}
 */

/**
 * Returns a component that will perform the given dynamic import and render
 * `Components.DynamicLoading` in the meantime.
 *
 * @example Register a component with a dynamic import
 *  registerComponent('MyComponent', dynamicLoader(() => import('./path/to/MyComponent')));
 *
 * @example Pass a dynamic component to a route
 *  import { addRoute, dynamicLoader, getDynamicComponent } from 'meteor/vulcan:core';
 *
 *  addRoute({
 *    name: 'home',
 *    path: '/',
 *    component: dynamicLoader(() => import('./path/to/HomeComponent')),
 *  });
 *
 * @param {dynamicLoader~importComponent|Promise<React.Component>} importComponent
 *  Function where the dynamic import is performed
 * @return {React.Component}
 *  Component that will load the dynamic import on mount
 */
export const dynamicLoader = importComponent =>
  loadable({
    loader: isFunction(importComponent) ? importComponent : () => importComponent, // backwards compatibility,
    // use delayedComponent, as this function can be used when Components is not populated yet
    loading: delayedComponent('DynamicLoading'),
  });

/**
 * Renders a dynamic component with the given props.
 *
 * @param {dynamicLoader~importComponent|Promise<React.Component>} importComponent
 * @param {Object} props
 */
export const renderDynamicComponent = (importComponent, props = {}) =>
  React.createElement(dynamicLoader(importComponent), props);

export const getDynamicComponent = componentImport => {
  // eslint-disable-next-line no-console
  console.warn(
    'getDynamicComponent is deprecated, use renderDynamicComponent instead.',
    'If you want to retrieve the component instead that of just rendering it,',
    'use dynamicLoader. See this issue to know how to do it: https://github.com/VulcanJS/Vulcan/issues/1997'
  );
  return renderDynamicComponent(componentImport);
};
