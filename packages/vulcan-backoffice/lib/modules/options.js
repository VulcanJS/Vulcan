/**
 * Setup default options and provides helper to generate valid options based
 * on these defaults
 */
import _merge from 'lodash/merge';

export const devOptions = {
  list: { accessGroups: ['guests', 'members', 'admins'] },
  item: { accessGroups: ['guests', 'members', 'admins'] },
  menuItem: { groups: ['guests', 'members', 'admins'] },
  layoutName: 'VulcanBackofficeLayout'
};

const defaultCollectionOptions = {
  list: { accessGroups: ['admins'], accessRedirect: '/' },
  item: { accessGroups: ['admins'], accessRedirect: '/' },
  menuItem: {
    groups: ['admins'],
  },
  layoutName: 'VulcanBackofficeLayout',
};

const defaultBackofficeOptions = {
  //generateUI: true,
  basePath: '/backoffice',
  ...defaultCollectionOptions,
};

export const mergeDefaultCollectionOptions = (collectionOptions, options = {}) =>
  _merge({}, defaultBackofficeOptions, options, collectionOptions);
export const mergeDefaultBackofficeOptions = options =>
  _merge({}, defaultBackofficeOptions, options);
