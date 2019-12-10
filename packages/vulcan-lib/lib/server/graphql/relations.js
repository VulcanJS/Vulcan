/*

Default Relation Resolvers

*/
import { getCollectionByTypeName } from '../../modules/collections.js';

export const hasOne = async ({ document, fieldName, context, typeName }) => {
  // if document doesn't have a "foreign key" field, return null
  if (!document[fieldName]) return null;
  // get related collection
  const relatedCollection = getCollectionByTypeName(typeName);
  // get related document
  const relatedDocument = await relatedCollection.loader.load(document[fieldName]);
  // filter related document to restrict viewable fields
  return context.Users.restrictViewableFields(
    context.currentUser,
    relatedCollection,
    relatedDocument
  );
};

export const hasMany = async ({ document, fieldName, context, typeName }) => {
  // if document doesn't have a "foreign key" field, return null
  if (!document[fieldName]) return null;
  // get related collection
  const relatedCollection = getCollectionByTypeName(typeName);
  // get related documents
  const relatedDocuments = await relatedCollection.loader.loadMany(document[fieldName]);
  // filter related document to restrict viewable fields
  return context.Users.restrictViewableFields(
    context.currentUser,
    relatedCollection,
    relatedDocuments
  );
};