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
import { validateDocument, validateData, dataToModifier, modifierToData } from '../modules/validation.js';
import { registerSetting } from '../modules/settings.js';
import { debug, debugGroup, debugGroupEnd } from '../modules/debug.js';
import { throwError } from '../modules/errors.js';
import { Connectors } from './connectors.js';
import pickBy from 'lodash/pickBy';
import clone from 'lodash/clone';
import isEmpty from 'lodash/isEmpty';

registerSetting('database', 'mongo', 'Which database to use for your back-end');

export const createMutator = async ({ collection, document, data, currentUser, validate, context }) => {

  const { collectionName, typeName } = collection.options;

  debug('');
  debugGroup(`--------------- start \x1b[36m${collectionName} Create Mutator\x1b[0m ---------------`);
  debug(`validate: ${validate}`);
  debug(document || data);

  // we don't want to modify the original document
  let newDocument = Object.assign({}, document || data);

  const schema = collection.simpleSchema()._schema;

  const callbackProperties = { currentUser, collection, context };

  if (validate) {

    let validationErrors = [];
    
    validationErrors = validationErrors.concat(validateDocument(newDocument, collection, context));

    // run validation callbacks
    validationErrors = await runCallbacks({ name: `${typeName.toLowerCase()}.create.validate`, iterator: validationErrors, properties: { ...callbackProperties, document: newDocument } });
    validationErrors = await runCallbacks({ name: '*.create.validate', iterator: validationErrors, properties: { ...callbackProperties, document: newDocument } });
    // OpenCRUD backwards compatibility
    newDocument = await runCallbacks(`${collectionName.toLowerCase()}.new.validate`, newDocument, currentUser, validationErrors);
    
    if (validationErrors.length) {
      throwError({ id: 'app.validation_error', data: {break: true, errors: validationErrors}});
    }

  }
  
  // if user is logged in, check if userId field is in the schema and add it to document if needed
  if (currentUser) {
    const userIdInSchema = Object.keys(schema).find(key => key === 'userId');
    if (!!userIdInSchema && !newDocument.userId) newDocument.userId = currentUser._id;
  }

  /* 
  
  run onCreate step

  note: cannot use forEach with async/await. 
  See https://stackoverflow.com/a/37576787/649299

  note: clone arguments in case callbacks modify them

  */
  for(let fieldName of Object.keys(schema)) {
    let autoValue;
    if (schema[fieldName].onCreate) {
      // OpenCRUD backwards compatibility: keep both newDocument and data for now, but phase our newDocument eventually
      // eslint-disable-next-line no-await-in-loop
      autoValue = await schema[fieldName].onCreate({ newDocument: clone(newDocument), data: clone(newDocument), currentUser, context });
    } else if (schema[fieldName].onInsert) {
      // OpenCRUD backwards compatibility
      // eslint-disable-next-line no-await-in-loop
      autoValue = await schema[fieldName].onInsert(clone(newDocument), currentUser);
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
  newDocument = await runCallbacks({ name: `${typeName.toLowerCase()}.create.before`, iterator: newDocument, properties: callbackProperties });
  newDocument = await runCallbacks({ name: '*.create.before', iterator: newDocument, properties: callbackProperties });
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName.toLowerCase()}.new.before`, newDocument, currentUser);
  newDocument = await runCallbacks(`${collectionName.toLowerCase()}.new.sync`, newDocument, currentUser);

  // add _id to document
  newDocument._id = await Connectors.create(collection, newDocument);

  // run any post-operation sync callbacks
  newDocument = await runCallbacks({ name: `${typeName.toLowerCase()}.create.after`, iterator: newDocument, properties: callbackProperties });
  newDocument = await runCallbacks({ name: '*.create.after', iterator: newDocument, properties: callbackProperties });
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName.toLowerCase()}.new.after`, newDocument, currentUser);

  // get fresh copy of document from db
  // TODO: not needed?
  const insertedDocument = await Connectors.get(collection, newDocument._id);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  await runCallbacksAsync({ name: `${typeName.toLowerCase()}.create.async`, properties: { insertedDocument, document: insertedDocument, ...callbackProperties }});
  await runCallbacksAsync({ name: '*.create.async', properties: { insertedDocument, document: insertedDocument, ...callbackProperties }});
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName.toLowerCase()}.new.async`, insertedDocument, currentUser, collection);

  debug('\x1b[33m=> created new document: \x1b[0m');
  debug(newDocument);
  debugGroupEnd();
  debug(`--------------- end \x1b[36m${collectionName} Create Mutator\x1b[0m ---------------`);
  debug('');

  return { data: newDocument };
}


export const updateMutator = async ({ collection, documentId, selector, data, set = {}, unset = {}, currentUser, validate, context, document }) => {

  const { collectionName, typeName } = collection.options;

  const schema = collection.simpleSchema()._schema;

  // OpenCRUD backwards compatibility
  selector = selector || { _id: documentId };
  data = data || modifierToData({ $set: set, $unset: unset });

  if (isEmpty(selector)) {
    throw new Error('Selector cannot be empty');
  }

  // get original document from database or arguments
  document = document || await Connectors.get(collection, selector);

  if (!document) {
    throw new Error(`Could not find document to update for selector: ${JSON.stringify(selector)}`);
  }
  
  const callbackProperties = { data, document, currentUser, collection, context };

  debug('');
  debugGroup(`--------------- start \x1b[36m${collectionName} Update Mutator\x1b[0m ---------------`);
  debug('// collectionName: ', collectionName);
  debug('// selector: ', selector);
  debug('// data: ', data);

  if (validate) {

    let validationErrors = [];

    validationErrors =  validationErrors.concat(validateData(data, document, collection, context));
    
    validationErrors = await runCallbacks({ name: `${typeName.toLowerCase()}.update.validate`, iterator: validationErrors, properties: callbackProperties });
    validationErrors = await runCallbacks({ name: '*.update.validate', iterator: validationErrors, properties: callbackProperties });
    // OpenCRUD backwards compatibility
    data = modifierToData(await runCallbacks(`${collectionName.toLowerCase()}.edit.validate`, dataToModifier(data), document, currentUser, validationErrors));

    if (validationErrors.length) {
      // eslint-disable-next-line no-console
      console.log('// validationErrors');
      // eslint-disable-next-line no-console
      console.log(validationErrors);
      throwError({ id: 'app.validation_error', data: {break: true, errors: validationErrors}});
    }

  }

  // get a "preview" of the new document
  let newDocument = { ...document, ...data};
  newDocument = pickBy(newDocument, f => f !== null);

  // run onUpdate step
  for(let fieldName of Object.keys(schema)) {
    let autoValue;
    if (schema[fieldName].onUpdate) {
      // eslint-disable-next-line no-await-in-loop
      autoValue = await schema[fieldName].onUpdate({ data: clone(data), document, currentUser, newDocument, context });
    } else if (schema[fieldName].onEdit) {
      // OpenCRUD backwards compatibility
      // eslint-disable-next-line no-await-in-loop
      autoValue = await schema[fieldName].onEdit(dataToModifier(clone(data)), document, currentUser, newDocument);
    }
    if (typeof autoValue !== 'undefined') {
      data[fieldName] = autoValue;
    }
  }

  // run sync callbacks
  data = await runCallbacks({ name: `${typeName.toLowerCase()}.update.before`, iterator: data, properties: { newDocument, ...callbackProperties }});
  data = await runCallbacks({ name: '*.update.before', iterator: data, properties: { newDocument, ...callbackProperties }});
  // OpenCRUD backwards compatibility
  data = modifierToData(await runCallbacks(`${collectionName.toLowerCase()}.edit.before`, dataToModifier(data), document, currentUser, newDocument));
  data = modifierToData(await runCallbacks(`${collectionName.toLowerCase()}.edit.sync`, dataToModifier(data), document, currentUser, newDocument));

  // update connector requires a modifier, so get it from data
  const modifier = dataToModifier(data);

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
  newDocument = await runCallbacks({ name: `${typeName.toLowerCase()}.update.after`, iterator: newDocument, properties: callbackProperties });
  newDocument = await runCallbacks({ name: '*.update.after', iterator: newDocument, properties: callbackProperties });
  // OpenCRUD backwards compatibility
  newDocument = await runCallbacks(`${collectionName.toLowerCase()}.edit.after`, newDocument, document, currentUser);

  // run async callbacks
  await runCallbacksAsync({ name: `${typeName.toLowerCase()}.update.async`, properties: { newDocument, ...callbackProperties }});
  await runCallbacksAsync({ name: '*.update.async', properties: { newDocument, ...callbackProperties }});
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName.toLowerCase()}.edit.async`, newDocument, document, currentUser, collection);

  debug('\x1b[33m=> updated document with modifier: \x1b[0m');
  debug('// modifier: ', modifier)
  debugGroupEnd();
  debug(`--------------- end \x1b[36m${collectionName} Update Mutator\x1b[0m ---------------`);
  debug('');

  return { data: newDocument };
}

export const deleteMutator = async ({ collection, documentId, selector, currentUser, validate, context, document }) => {

  const { collectionName, typeName } = collection.options;

  debug('');
  debugGroup(`--------------- start \x1b[36m${collectionName} Delete Mutator\x1b[0m ---------------`);
  debug('// collectionName: ', collectionName);
  debug('// selector: ', selector);

  const schema = collection.simpleSchema()._schema;

  // OpenCRUD backwards compatibility
  selector = selector || { _id: documentId };

  if (isEmpty(selector)) {
    throw new Error('Selector cannot be empty');
  }

  document = document || await Connectors.get(collection, selector);

  if (!document) {
    throw new Error(`Could not find document to delete for selector: ${JSON.stringify(selector)}`);
  }

  const callbackProperties = { document, currentUser, collection, context };

  if (validate) {

    let validationErrors = [];

    validationErrors = await runCallbacks({ name: `${typeName.toLowerCase()}.delete.validate`, iterator: validationErrors, properties: callbackProperties });
    validationErrors = await runCallbacks({ name: '*.delete.validate', iterator: validationErrors, properties: callbackProperties });
    // OpenCRUD backwards compatibility
    document = await runCallbacks(`${collectionName.toLowerCase()}.remove.validate`, document, currentUser);

    if (validationErrors.length) {
      // eslint-disable-next-line no-console
      console.log('// validationErrors');
      // eslint-disable-next-line no-console
      console.log(validationErrors);
      throwError({id: 'app.validation_error', data: {break: true, errors: validationErrors}});
    }

  }

  // run onRemove step
  for(let fieldName of Object.keys(schema)) {
    if (schema[fieldName].onDelete) {
      // eslint-disable-next-line no-await-in-loop
      await schema[fieldName].onDelete({ document, currentUser, context });
    } else if (schema[fieldName].onRemove) {
      // OpenCRUD backwards compatibility
      // eslint-disable-next-line no-await-in-loop
      await schema[fieldName].onRemove(document, currentUser);
    }
  }

  await runCallbacks({ name: `${typeName.toLowerCase()}.delete.before`, iterator: document, properties: callbackProperties });
  await runCallbacks({ name: '*.delete.before', iterator: document, properties: callbackProperties });
  // OpenCRUD backwards compatibility
  await runCallbacks(`${collectionName.toLowerCase()}.remove.before`, document, currentUser);
  await runCallbacks(`${collectionName.toLowerCase()}.remove.sync`, document, currentUser);

  await Connectors.delete(collection, selector);

  // TODO: add support for caching by other indexes to Dataloader
  // clear cache if needed
  if (selector.documentId && collection.loader) {
    collection.loader.clear(selector.documentId);
  }

  await runCallbacksAsync({ name: `${typeName.toLowerCase()}.delete.async`, properties: callbackProperties });
  await runCallbacksAsync({ name: '*.delete.async', properties: callbackProperties });
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(`${collectionName.toLowerCase()}.remove.async`, document, currentUser, collection);

  debugGroupEnd();
  debug(`--------------- end \x1b[36m${collectionName} Delete Mutator\x1b[0m ---------------`);
  debug('');

  return { data: document };
}

// OpenCRUD backwards compatibility
export const newMutation = createMutator;
export const editMutation = updateMutator;
export const removeMutation = deleteMutator;
export const newMutator = createMutator;
export const editMutator = updateMutator;
export const removeMutator = deleteMutator;
