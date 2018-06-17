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
import { validateDocument, validateModifier, validateData, dataToModifier } from '../modules/validation.js';
import { registerSetting } from '../modules/settings.js';
import { debug } from '../modules/debug.js';
import { Connectors } from './connectors.js';

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
    newDocument = runCallbacks({ name: `${collectionName}.create.validate`, iterator: newDocument, properties: { currentUser, validationErrors }});
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
  for(let fieldName of Object.keys(schema)) {
    let autoValue;
    if (schema[fieldName].onCreate) {
      autoValue = await schema[fieldName].onCreate({ newDocument, currentUser });
    } else if (schema[fieldName].onInsert) {
      // OpenCRUD backwards compatibility
      autoValue = await schema[fieldName].onInsert(newDocument, currentUser);
    }
    if (typeof autoValue !== 'undefined') {
      newDocument[fieldName] = autoValue;
    }
  }

  // TODO: find that info in GraphQL mutations
  // if (Meteor.isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders['user-agent'];
  // }

  // run sync callbacks
  newDocument = await runCallbacks({ name: `${collectionName}.create.before`, iterator: newDocument, properties: { currentUser }});
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName}.new.before`, newDocument, currentUser);
  newDocument = await runCallbacks(`${collectionName}.new.sync`, newDocument, currentUser);

  // add _id to document
  newDocument._id = await Connectors.create(collection, newDocument);

  // run any post-operation sync callbacks
  newDocument = await runCallbacks({ name: `${collectionName}.create.after`, iterator: newDocument, properties: { currentUser }});
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName}.new.after`, newDocument, currentUser);

  // get fresh copy of document from db
  // TODO: not needed?
  const insertedDocument = await Connectors.get(collection, newDocument._id);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  await runCallbacksAsync({ name: `${collectionName}.create.async`, properties: { insertedDocument, currentUser, collection }});
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName}.new.async`, insertedDocument, currentUser, collection);

  debug('// createMutator finished:');
  debug(newDocument);
  debug('//------------------------------------//');

  return { data: newDocument };
}


export const updateMutator = async ({ collection, selector, data, set = {}, unset = {}, currentUser, validate, context }) => {

  if (!selector) {
    throw new Error(`You must pass a "selector" argument to updateMutator`);
  }

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  // OpenCRUD backwards compatibility
  // build mongo modifier from arguments
  let modifier = {};
  if (!data) {
    modifier = { $set: set, $unset: unset }
  }

  // get original document from database
  // TODO: avoid fetching document a second time if possible
  let document = await Connectors.get(collection, selector);
  
  debug('//------------------------------------//');
  debug('// updateMutator');
  debug('// collectionName: ', collection._name);
  debug('// selector: ', selector);
  debug('// modifier: ', modifier);
  debug('// document: ', document);

  if (validate) {

    let validationErrors;

    if (data) {
      validationErrors =  validateData(data, document, collection, context);
      data = runCallbacks({ name: `${collectionName}.update.validate`, iterator: data, properties: { document, currentUser, validationErrors }});
    } else {
      // OpenCRUD backwards compatibility
      validationErrors = validateModifier(modifier, document, collection, context);
      modifier = runCallbacks(`${collectionName}.edit.validate`, modifier, document, currentUser, validationErrors);
    }

    if (validationErrors.length) {
      // eslint-disable-next-line no-console
      console.log('// validationErrors');
      // eslint-disable-next-line no-console
      console.log(validationErrors);
      const EditDocumentValidationError = createError('app.validation_error', { message: 'app.edit_document_validation_error' });
      throw new EditDocumentValidationError({data: {break: true, errors: validationErrors}});
    }

  }

  // get a "preview" of the new document
  let newDocument = { ...document, ...modifier.$set};
  modifier.$unset && Object.keys(modifier.$unset).forEach(fieldName => {
    delete newDocument[fieldName];
  });

  // run onUpdate step
  for(let fieldName of Object.keys(schema)) {
    let autoValue;
    if (schema[fieldName].onUpdate) {
      autoValue = await schema[fieldName].onUpdate({ data, document, currentUser, newDocument });
    } else if (schema[fieldName].onEdit) {
    // OpenCRUD backwards compatibility
      autoValue = await schema[fieldName].onEdit(modifier, document, currentUser, newDocument);
    }
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

  // run sync callbacks (on mongo modifier)
  data = await runCallbacks({ name: `${collectionName}.update.before`, iterator: data, properties: { document, currentUser, newDocument }});
  // OpenCRUD backwards compatibility
  modifier = await runCallbacks(`${collectionName}.edit.before`, modifier, document, currentUser, newDocument);
  modifier = await runCallbacks(`${collectionName}.edit.sync`, modifier, document, currentUser, newDocument);

    
  // update connector requires a modifier, so get it from data
  if (data) {
    modifier = dataToModifier(data);
  }

  // remove empty modifiers
  if (_.isEmpty(modifier.$set)) {
    delete modifier.$set;
  }
  if (_.isEmpty(modifier.$unset)) {
    delete modifier.$unset;
  }

  if (!_.isEmpty(modifier)) {
    // update document
    await Connectors.update(collection, selector, modifier, { removeEmptyStrings: false });

    // get fresh copy of document from db
    newDocument = await Connectors.get(collection, selector);

    // TODO: add support for caching by other indexes to Dataloader
    // https://github.com/VulcanJS/Vulcan/issues/2000
    // clear cache if needed
    if (selector.documentId && collection.loader) {
      collection.loader.clear(selector.documentId);
    }
  }

  // run any post-operation sync callbacks
  newDocument = await runCallbacks({ name: `${collectionName}.update.after`, iterator: newDocument, properties: { document, currentUser }});
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName}.edit.after`, newDocument, document, currentUser);

  // run async callbacks
  await runCallbacksAsync({ name: `${collectionName}.update.async`, properties: { newDocument, document, currentUser, collection }});
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName}.edit.async`, newDocument, document, currentUser, collection);

  debug('// updateMutator finished')
  debug('// modifier: ', modifier)
  debug('// updated document: ', newDocument)
  debug('//------------------------------------//');

  return { data: newDocument };
}

export const deleteMutator = async ({ collection, selector, currentUser, validate, context }) => {

  debug('//------------------------------------//');
  debug('// deleteMutator')
  debug(collection._name)
  debug(selector)
  debug('//------------------------------------//');
  
  if (!selector) {
    throw new Error(`You must pass a "selector" argument to updateMutator`);
  }

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  let document = await Connectors.get(collection, selector);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = runCallbacks({ name: `${collectionName}.delete.validate`, iterator: document, properties: { currentUser }});
    // OpenCRUD backwards compatibility
    document = runCallbacks(`${collectionName}.remove.validate`, document, currentUser);
  }

  // run onRemove step
  for(let fieldName of Object.keys(schema)) {
    if (schema[fieldName].onDelete) {
      await schema[fieldName].onDelete({ document, currentUser });
    } else if (schema[fieldName].onRemove) {
      // OpenCRUD backwards compatibility
      await schema[fieldName].onRemove(document, currentUser);
    }
  }

  await runCallbacks({ name: `${collectionName}.delete.before`, iterator: document, properties: { currentUser }});
  // OpenCRUD backwards compatibility
  await runCallbacks(`${collectionName}.remove.before`, document, currentUser);
  await runCallbacks(`${collectionName}.remove.sync`, document, currentUser);

  await Connectors.delete(collection, selector);

  // TODO: add support for caching by other indexes to Dataloader
  // clear cache if needed
  if (selector.documentId && collection.loader) {
    collection.loader.clear(selector.documentId);
  }

  await runCallbacksAsync({ name: `${collectionName}.delete.async`, properties: { document, currentUser, collection }});
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