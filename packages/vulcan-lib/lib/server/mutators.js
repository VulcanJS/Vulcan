/*

Mutations have four steps:

1. Validation

If the mutation call is not trusted (i.e. it comes from a GraphQL mutation),
we'll run all validate steps:

- Check that the current user has permission to insert/edit each field.
- Add userId to document (insert only).
- Run validation callbacks.

2. Sync Callbacks

The second step is to run the mutation argument through all the sync callbacks.

3. Operation

We then perform the insert/update/remove operation.

4. Async Callbacks

Finally, *after* the operation is performed, we execute any async callbacks.
Being async, they won't hold up the mutation and slow down its response time
to the client.

*/

import { runCallbacks, runCallbacksAsync } from '../modules/index.js';
import { createError } from 'apollo-errors';
import { validateDocument, validateModifier } from '../modules/validation.js';
import { registerSetting } from '../modules/settings.js';
import { debug } from '../modules/debug.js';
import { Connectors } from './connectors.js';
import pickBy from 'lodash/pickBy';

registerSetting('database', 'mongo', 'Which database to use for your back-end');

export const createMutator = async ({ collection, document, data, currentUser, validate, context }) => {

  debug('//------------------------------------//');
  debug('// createMutator');
  debug(collection._name);
  debug(`validate: ${validate}`);
  debug(document || data);

  // we don't want to modify the original document
  let newDocument = Object.assign({}, document || data);

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  if (validate) {

    const validationErrors = validateDocument(newDocument, collection, context);

    // run validation callbacks
    newDocument = runCallbacks(`${collectionName}.create.validate`, newDocument, currentUser, validationErrors);
    // OpenCRUD backwards compatibility
    newDocument = runCallbacks(`${collectionName}.new.validate`, newDocument, currentUser, validationErrors);
    
    if (validationErrors.length) {
      const NewDocumentValidationError = createError('app.validation_error', {message: 'app.new_document_validation_error'});
      throw new NewDocumentValidationError({data: {break: true, errors: validationErrors}});
    }

  }
  
  // if user is logged in, check if userId field is in the schema and add it to document if needed
  if (currentUser) {
    const userIdInSchema = Object.keys(schema).find(key => key === 'userId');
    if (!!userIdInSchema && !newDocument.userId) newDocument.userId = currentUser._id;
  }
  
  // run onInsert step
  // note: cannot use forEach with async/await. 
  // See https://stackoverflow.com/a/37576787/649299
  for(let fieldName of _.keys(schema)) {
    const onCreate = schema[fieldName].onCreate || schema[fieldName].onInsert; // OpenCRUD backwards compatibility
    if (onCreate) {
      const autoValue = await onCreate(newDocument, currentUser);
      if (typeof autoValue !== 'undefined') {
        newDocument[fieldName] = autoValue;
      }
    }
  }

  // TODO: find that info in GraphQL mutations
  // if (Meteor.isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders['user-agent'];
  // }

  // run sync callbacks
  newDocument = await runCallbacks(`${collectionName}.create.before`, newDocument, currentUser);
  newDocument = await runCallbacks(`${collectionName}.create.sync`, newDocument, currentUser);
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName}.new.before`, newDocument, currentUser);
  newDocument = await runCallbacks(`${collectionName}.new.sync`, newDocument, currentUser);

  // add _id to document
  newDocument._id = await Connectors.create(collection, newDocument);

  // run any post-operation sync callbacks
  newDocument = await runCallbacks(`${collectionName}.create.after`, newDocument, currentUser);
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName}.new.after`, newDocument, currentUser);

  // get fresh copy of document from db
  // TODO: not needed?
  const insertedDocument = await Connectors.get(collection, newDocument._id);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  await runCallbacksAsync(`${collectionName}.create.async`, insertedDocument, currentUser, collection);
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName}.new.async`, insertedDocument, currentUser, collection);

  debug('// createMutator finished:');
  debug(newDocument);
  debug('//------------------------------------//');

  return { data: newDocument };
}


export const updateMutator = async ({ collection, documentId, data, set = {}, unset = {}, currentUser, validate, context }) => {

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  // build mongo modifier from arguments
  let modifier = {};
  if (data) {
    modifier = { $set: pickBy(data, f => f !== null), $unset: Object.keys(pickBy(data, f => f === null)).map(f => ({[f]: true})) };
  } else {
    modifier = { $set: set, $unset: unset }
  }
  // get original document from database
  // TODO: avoid fetching document a second time if possible
  let document = await Connectors.get(collection, documentId);
  
  debug('//------------------------------------//');
  debug('// updateMutator');
  debug('// collectionName: ', collection._name);
  debug('// documentId: ', documentId);
  debug('// modifier: ', modifier);
  debug('// document: ', document);

  if (validate) {

    const validationErrors = validateModifier(modifier, document, collection, context);

    modifier = runCallbacks(`${collectionName}.update.validate`, modifier, document, currentUser, validationErrors);
    // OpenCRUD backwards compatibility
    modifier = runCallbacks(`${collectionName}.edit.validate`, modifier, document, currentUser, validationErrors);

    if (validationErrors.length) {
      // eslint-disable-next-line no-console
      console.log('// validationErrors');
      // eslint-disable-next-line no-console
      console.log(validationErrors);
      const EditDocumentValidationError = createError('app.validation_error', {message: 'app.edit_document_validation_error'});
      throw new EditDocumentValidationError({data: {break: true, errors: validationErrors}});
    }

  }

  // get a "preview" of the new document
  let newDocument = { ...document, ...modifier.$set};
  Object.keys(modifier.$unset).forEach(fieldName => {
    delete newDocument[fieldName];
  });

  // run onEdit step
  for(let fieldName of _.keys(schema)) {
    const onUpdate = schema[fieldName].onUpdate || schema[fieldName].onEdit; // OpenCRUD backwards compatibility
    if (onUpdate) {
      const autoValue = await onUpdate(modifier, document, currentUser, newDocument);
      if (typeof autoValue !== 'undefined') {
        if (autoValue === null) {
          // if any autoValue returns null, then unset the field
          modifier.$unset[fieldName] = true;
        } else {
          modifier.$set[fieldName] = autoValue;
          // make sure we don't try to unset the same field at the same time
          delete modifier.$unset[fieldName];
        }
      }
    }
  }

  // run sync callbacks (on mongo modifier)
  modifier = await runCallbacks(`${collectionName}.edit.before`, modifier, document, currentUser, newDocument);
  modifier = await runCallbacks(`${collectionName}.edit.sync`, modifier, document, currentUser, newDocument);
  // OpenCRUD backwards compatibility
  modifier = await runCallbacks(`${collectionName}.update.before`, modifier, document, currentUser, newDocument);
  modifier = await runCallbacks(`${collectionName}.update.sync`, modifier, document, currentUser, newDocument);

  // remove empty modifiers
  if (_.isEmpty(modifier.$set)) {
    delete modifier.$set;
  }
  if (_.isEmpty(modifier.$unset)) {
    delete modifier.$unset;
  }
  
  if (!_.isEmpty(modifier)) {
    // update document
    await Connectors.update(collection, documentId, modifier, {removeEmptyStrings: false});

    // get fresh copy of document from db
    newDocument = await Connectors.get(collection, documentId);

    // clear cache if needed
    if (collection.loader) {
      collection.loader.clear(documentId);
    }
  }

  // run any post-operation sync callbacks
  newDocument = await runCallbacks(`${collectionName}.update.after`, newDocument, document, currentUser);
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName}.edit.after`, newDocument, document, currentUser);

  // run async callbacks
  await runCallbacksAsync(`${collectionName}.update.async`, newDocument, document, currentUser, collection);
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName}.edit.async`, newDocument, document, currentUser, collection);

  debug('// updateMutator finished')
  debug('// modifier: ', modifier)
  debug('// updated document: ', newDocument)
  debug('//------------------------------------//');

  return { data: newDocument };
}

export const deleteMutator = async ({ collection, documentId, currentUser, validate, context }) => {

  debug('//------------------------------------//');
  debug('// deleteMutator')
  debug(collection._name)
  debug(documentId)
  debug('//------------------------------------//');
  
  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  let document = await Connectors.get(collection, documentId);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = runCallbacks(`${collectionName}.delete.validate`, document, currentUser);
    // OpenCRUD backwards compatibility
    document = runCallbacks(`${collectionName}.remove.validate`, document, currentUser);
  }

  // run onRemove step
  for(let fieldName of _.keys(schema)) {
    const onDelete = schema[fieldName].onDelete || schema[fieldName].onRemove; // OpenCRUD backwards compatibility
    if (onDelete) {
      await onDelete(document, currentUser);
    }
  }

  await runCallbacks(`${collectionName}.delete.before`, document, currentUser);
  await runCallbacks(`${collectionName}.delete.sync`, document, currentUser);
  // OpenCRUD backwards compatibility
  await runCallbacks(`${collectionName}.remove.before`, document, currentUser);
  await runCallbacks(`${collectionName}.remove.sync`, document, currentUser);

  await Connectors.delete(collection, documentId);

  // clear cache if needed
  if (collection.loader) {
    collection.loader.clear(documentId);
  }

  await runCallbacksAsync(`${collectionName}.delete.async`, document, currentUser, collection);
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName}.remove.async`, document, currentUser, collection);

  return { data: document };
}

// OpenCRUD backwards compatibility
export const newMutation = createMutator;
export const editMutation = updateMutator;
export const removeMutation = deleteMutator;
export const newMutator = createMutator;
export const editMutator = updateMutator;
export const removeMutator = deleteMutator;