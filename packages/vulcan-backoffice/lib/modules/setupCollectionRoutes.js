import { addRoute } from 'meteor/vulcan:core';
import {
  getBasePath,
  getBaseRouteName,
  getDetailsPath,
  getListComponentName,
  getItemComponentName,
} from './namingHelpers';
import { mergeDefaultCollectionOptions } from './options';
import _values from 'lodash/values';

export const generateRoutes = (collection, options) => {
  const basePath = getBasePath(collection, options.basePath);
  const detailsPath = getDetailsPath(collection, options.basePath);
  const baseRouteName = getBaseRouteName(collection);
  const routes = {
    listRoute: {
      name: 'vulcan-backoffice-' + baseRouteName,
      path: basePath,
      componentName: getListComponentName(collection),
      returnRoute: basePath,
      layoutName: options.layoutName,
    },
    itemRoute: {
      name: 'vulcan-backoffice-' + baseRouteName + '-details',
      path: detailsPath,
      componentName: getItemComponentName(collection),
      returnRoute: basePath,
      layoutName: options.layoutName,
    },
  };
  return routes;
};
export default (collection, providedOptions = {}) => {
  const options = mergeDefaultCollectionOptions(providedOptions);
  const routes = generateRoutes(collection, options);
  _values(routes).forEach(route => {
    addRoute(route);
  });
  return routes;
};
