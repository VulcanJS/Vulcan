/**
 * Setup default options and provides helper to generate valid options based
 * on these defaults
 */
import _merge from 'lodash/merge';

const defaultCollectionOptions = {
  list: { accessGroups: ['admins'], accessRedirect: '/' },
  item: { accessGroups: ['admins'], accessRedirect: '/' },
  menuItem: {
    groups: ['admins'],
  },
  layoutName: 'VulcanBackofficeLayout',
};

const defaultBackofficeOptions = {
  generateRoutes: true,
  generateMenuItems: true,
  generateComponents: true,
  //generateUI: true,
  basePath: '/backoffice',
  ...defaultCollectionOptions,
};

export const mergeDefaultCollectionOptions = (collectionOptions, options = {}) =>
  _merge({}, defaultBackofficeOptions, options, collectionOptions);
export const mergeDefaultBackofficeOptions = options =>
  _merge({}, defaultBackofficeOptions, options);
