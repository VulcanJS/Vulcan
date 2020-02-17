/**
 * Create List and Item components for the provided collection,
 * based on the generic Vulcan backoffice components
 */
import createListComponent from './createListComponent';
import createItemComponent from './createItemComponent';
import { mergeDefaultCollectionOptions } from '../options';

const createCollectionComponents = (collection, options) => {
  const mergedOptions = mergeDefaultCollectionOptions(options);
  const ListComponent = createListComponent(collection, mergedOptions);
  const ItemComponent = createItemComponent(collection, mergedOptions);
  return { ListComponent, ItemComponent };
};
export default createCollectionComponents;
