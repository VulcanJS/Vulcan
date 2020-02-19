/** Setup a full fledged backoffice
 * - create components
 * - create routes
 * - register menu items
 */
import { addRoute } from 'meteor/vulcan:core';
import { mergeDefaultBackofficeOptions, mergeDefaultCollectionOptions } from './options';
import { getCollectionName } from './namingHelpers';
import createCollectionComponents from './createCollectionComponents';
import setupCollectionRoutes from './setupCollectionRoutes';
import setupCollectionMenuItems from './setupCollectionMenuItems';

const setupBackoffice = (collections, providedOptions = {}, collectionsOptions = {}) => {
  const options = mergeDefaultBackofficeOptions(providedOptions);
  // pages for each collection
  collections.forEach(collection => {
    const collectionName = getCollectionName(collection);
    const collectionOptions = mergeDefaultCollectionOptions(
      collectionsOptions[collectionName],
      options
    );
    const { ListComponent, ItemComponent } = createCollectionComponents(
      collection,
      collectionOptions
    );
    setupCollectionRoutes(collection, collectionOptions);
    setupCollectionMenuItems(collection, collectionOptions);
  });
  // index
  addRoute({
    name: 'vulcan-backoffice', path: options.basePath,
    componentName: 'VulcanBackofficeIndex',
    layoutName: 'VulcanBackofficeLayout',
    options
  }); // setup the route
};

export default setupBackoffice;
