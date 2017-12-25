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
import { debug } from '../modules/debug.js';

export const newMutation = async ({ collection, document, currentUser, validate, context }) => {

  debug('//------------------------------------//');
  debug('// newMutation');
  debug(collection._name);
  debug(`validate: ${validate}`);
  debug(document);

  // we don't want to modify the original document
  let newDocument = Object.assign({}, document);

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  if (validate) {

    const validationErrors = validateDocument(newDocument, collection, context);

    // run validation callbacks
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
    if (schema[fieldName].onInsert) {
      const autoValue = await schema[fieldName].onInsert(newDocument, currentUser);
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
  newDocument = await runCallbacks(`${collectionName}.new.before`, newDocument, currentUser);
  newDocument = await runCallbacks(`${collectionName}.new.sync`, newDocument, currentUser);

  // add _id to document
  newDocument._id = collection.insert(newDocument);

  // run any post-operation sync callbacks
  newDocument = await runCallbacks(`${collectionName}.new.after`, newDocument, currentUser);

  // get fresh copy of document from db
  // TODO: not needed?
  const insertedDocument = collection.findOne(newDocument._id);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  await runCallbacksAsync(`${collectionName}.new.async`, insertedDocument, currentUser, collection);

  debug('// new mutation finished:');
  debug(newDocument);
  debug('//------------------------------------//');

  return newDocument;
}


export const editMutation = async ({ collection, documentId, set = {}, unset = {}, currentUser, validate, context }) => {

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  // build mongo modifier from arguments
  let modifier = {$set: set, $unset: unset};

  // get original document from database
  let document = collection.findOne(documentId);
  
  debug('//------------------------------------//');
  debug('// editMutation');
  debug('// collectionName: ', collection._name);
  debug('// documentId: ', documentId);
  // debug('// set: ', set);
  // debug('// unset: ', unset);
  // debug('// document: ', document);

  if (validate) {

    const validationErrors = validateModifier(modifier, document, collection, context);

    modifier = runCallbacks(`${collectionName}.edit.validate`, modifier, document, currentUser, validationErrors);

    if (validationErrors.length) {
      console.log('// validationErrors')
      console.log(validationErrors)
      const EditDocumentValidationError = createError('app.validation_error', {message: 'app.edit_document_validation_error'});
      throw new EditDocumentValidationError({data: {break: true, errors: validationErrors}});
    }

  }

  // run onEdit step
  for(let fieldName of _.keys(schema)) {

    if (schema[fieldName].onEdit) {
      const autoValue = await schema[fieldName].onEdit(modifier, document, currentUser);
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
  modifier = await runCallbacks(`${collectionName}.edit.before`, modifier, document, currentUser);
  modifier = await runCallbacks(`${collectionName}.edit.sync`, modifier, document, currentUser);

  // remove empty modifiers
  if (_.isEmpty(modifier.$set)) {
    delete modifier.$set;
  }
  if (_.isEmpty(modifier.$unset)) {
    delete modifier.$unset;
  }
  
  // update document
  collection.update(documentId, modifier, {removeEmptyStrings: false});

  // get fresh copy of document from db
  let newDocument = collection.findOne(documentId);

  // clear cache if needed
  if (collection.loader) {
    collection.loader.clear(documentId);
  }

  // run any post-operation sync callbacks
  newDocument = await runCallbacks(`${collectionName}.edit.after`, newDocument, document, currentUser);

  // run async callbacks
  await runCallbacksAsync(`${collectionName}.edit.async`, newDocument, document, currentUser, collection);

  debug('// edit mutation finished')
  debug('// modifier: ', modifier)
  debug('// edited document: ', newDocument)
  debug('//------------------------------------//');

  return newDocument;
}

export const removeMutation = async ({ collection, documentId, currentUser, validate, context }) => {

  debug('//------------------------------------//');
  debug('// removeMutation')
  debug(collection._name)
  debug(documentId)
  debug('//------------------------------------//');
  
  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  let document = collection.findOne(documentId);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = runCallbacks(`${collectionName}.remove.validate`, document, currentUser);
  }

  // run onRemove step
  for(let fieldName of _.keys(schema)) {
    if (schema[fieldName].onRemove) {
      await schema[fieldName].onRemove(document, currentUser);
    }
  }

  await runCallbacks(`${collectionName}.remove.before`, document, currentUser);
  await runCallbacks(`${collectionName}.remove.sync`, document, currentUser);

  collection.remove(documentId);

  // clear cache if needed
  if (collection.loader) {
    collection.loader.clear(documentId);
  }

  await runCallbacksAsync(`${collectionName}.remove.async`, document, currentUser, collection);

  return document;
}

export const newMutator = newMutation;
export const editMutator = editMutation;
export const removeMutator = removeMutation;