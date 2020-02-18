const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

export const getCollectionName = collection => {
  return collection.options.collectionName;
};
export const getCollectionDisplayName = collection =>
  capitalizeFirstLetter(getCollectionName(collection));

const makeComponentName = suffix => collection =>
  `VulcanBackoffice${capitalizeFirstLetter(getCollectionName(collection))}${suffix}`;

export const getItemComponentName = makeComponentName('Item');
export const getListComponentName = makeComponentName('List');
export const getFormComponentName = makeComponentName('Form');
export const getFragmentName = makeComponentName('DefaultFragment');
export const getBaseRouteName = collection => getCollectionName(collection).toLowerCase();

// return {basePath}/collection-name
export const getBasePath = (collection, basePath) => {
  const collectionBasePath = '/' + getBaseRouteName(collection);
  return typeof basePath !== 'undefined' ? basePath + collectionBasePath : collectionBasePath;
};
export const getNewPath = (collection, basePath) => getBasePath(collection, basePath) + '/create';
export const getEditPath = (collection, basePath) =>
  getBasePath(collection, basePath) + '/:documentId/edit';
export const getDetailsPath = (collection, basePath) =>
  getBasePath(collection, basePath) + '/:documentId';
