/** Add an item to the menu to access the collection */
import { addMenuItem, getMenuItems, getAuthorizedMenuItems } from 'meteor/vulcan:core';
import { getBasePath, getCollectionName, getCollectionDisplayName } from './namingHelpers';
import { mergeDefaultCollectionOptions } from './options';

const adminMenuName = 'vulcan-backoffice';

export const setupCollectionMenuItems = (collection, collectionOptions) => {
  const options = mergeDefaultCollectionOptions(collectionOptions);
  const labelToken = options.menuItem.labelToken;
  const label = !labelToken
    ? options.menuItem.label || getCollectionDisplayName(collection)
    : undefined;
  const collectionName = getCollectionName(collection);
  addMenuItem({
    name: collectionName,
    label,
    labelToken: labelToken,
    path: options.menuItem.basePath || getBasePath(collection, options.basePath),
    groups: options.menuItem.groups,
    menuGroup: adminMenuName,
  });
};
// to retrieve the items
export const getBackofficeMenuItems = () => getMenuItems(adminMenuName);
export const getAuthorizedBackofficeMenuItems = currentUser =>
  getAuthorizedMenuItems(currentUser, adminMenuName);

export default setupCollectionMenuItems;
