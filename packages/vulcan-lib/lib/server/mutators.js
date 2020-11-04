/*

Mutations have five steps:

1. Validation

If the mutator call is not trusted (for example, it comes from a GraphQL mutation),
we'll run all validate steps:

- Check that the current user has permission to insert/edit each field.
- Add userId to document (insert only).
- Run validation callbacks.

2. Before Callbacks

The second step is to run the mutation argument through all the [before] callbacks.

3. Operation

We then perform the insert/update/remove operation.

4. After Callbacks

We then run the mutation argument through all the [after] callbacks.

5. Async Callbacks

Finally, *after* the operation is performed, we execute any async callbacks.
Being async, they won't hold up the mutation and slow down its response time
to the client.

*/

import { runCallbacks, runCallbacksAsync } from '../modules/index.js';
import {
  validateDocument,
  validateData,
  dataToModifier,
  modifierToData,
} from '../modules/validation.js';
import { globalCallbacks } from '../modules/callbacks.js';
import { registerSetting } from '../modules/settings.js';
import { debug, debugGroup, debugGroupEnd } from '../modules/debug.js';
import { throwError } from './errors.js';
import { Connectors } from './connectors.js';
import pickBy from 'lodash/pickBy';
import clone from 'lodash/clone';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

registerSetting('database', 'mongo', 'Which database to use for your back-end');

/*

Create

*/
export const createMutator = async ({
  collection,
  document: originalDocument,
  data: originalData,
  currentUser,
  validate,
  context = {},
  contextName,
}) => {
  // OpenCRUD backwards compatibility: accept either data or document
  // we don't want to modify the original document
  let data = clone(originalData || originalDocument);

  const { collectionName, typeName } = collection.options;
  const schema = collection.simpleSchema()._schema;

  // get currentUser from context if possible
  if (!currentUser && context.currentUser) {
    currentUser = context.currentUser;
  }

  startDebugMutator(collectionName, 'Create', { validate, data });

  /*

  Properties

  Note: keep newDocument for backwards compatibility
  
  */
  const properties = {
    data,
    originalData,
    currentUser,
    collection,
    context,
    document: data, // backwards compatibility
    originalDocument, // backwards compatibility
    newDocument: data, // backwards compatibility
    schema,
    contextName,
  };

  /*

  Validation

  */
  if (validate) {
    let validationErrors = [];
    validationErrors = validationErrors.concat(validateDocument(data, collection, context, contextName));
    // new callback API (Oct 2019)
    validationErrors = await runCallbacks({
      name: `${typeName.toLowerCase()}.create.validate`,
      callbacks: get(collection, 'options.callbacks.create.validate', []),
      iterator: validationErrors,
      properties,
    });
    validationErrors = await runCallbacks({
      name: '*.create.validate',
      callbacks: get(globalCallbacks, 'create.validate', []),
      iterator: validationErrors,
      properties,
    });
    // run validation callbacks
    validationErrors = await runCallbacks({
      name: `${typeName.toLowerCase()}.create.validate`,
      iterator: validationErrors,
      properties,
    });
    validationErrors = await runCallbacks({
      name: '*.create.validate',
      iterator: validationErrors,
      properties,
    });
    // OpenCRUD backwards compatibility
    data = await runCallbacks(
      `${collectionName.toLowerCase()}.new.validate`,
      data,
      currentUser,
      validationErrors
    );
    if (validationErrors.length) {
      console.log(validationErrors); // eslint-disable-line no-console
      throwError({ id: 'app.validation_error', data: { break: true, errors: validationErrors } });
    }
  }
  /*

  userId

  If user is logged in, check if userId field is in the schema and add it to document if needed

  */
  if (currentUser) {
    const userIdInSchema = Object.keys(schema).find(key => key === 'userId');
    if (!!userIdInSchema && !data.userId) data.userId = currentUser._id;
  }
  /* 
  
  onCreate

  note: cannot use forEach with async/await. 
  See https://stackoverflow.com/a/37576787/649299

  note: clone arguments in case callbacks modify them

  */
  for (let fieldName of Object.keys(schema)) {
    try {
      let autoValue;
      if (schema[fieldName].onCreate) {
        // OpenCRUD backwards compatibility: keep both newDocument and data for now, but phase out newDocument eventually
        autoValue = await schema[fieldName].onCreate(properties); // eslint-disable-line no-await-in-loop
      } else if (schema[fieldName].onInsert) {
        // OpenCRUD backwards compatibility
        autoValue = await schema[fieldName].onInsert(clone(data), currentUser); // eslint-disable-line no-await-in-loop
      }
      if (typeof autoValue !== 'undefined') {
        data[fieldName] = autoValue;
      }
    } catch(e) {
      console.log(`// Autovalue error on field ${fieldName}`);
      console.log(e);
    }
  }
  // TODO: find that info in GraphQL mutations
  // if (Meteor.isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders['user-agent'];
  // }

  /*

  Before
  
  */
  // new callback API (Oct 2019)
  data = await runCallbacks({
    name: `${typeName.toLowerCase()}.create.before`,
    callbacks: get(collection, 'options.callbacks.create.before', []),
    iterator: data,
    properties,
  });
  data = await runCallbacks({
    name: '*.create.before',
    callbacks: get(globalCallbacks, 'create.before', []),
    iterator: data,
    properties,
  });
  // old callback API
  data = await runCallbacks({
    name: `${typeName.toLowerCase()}.create.before`,
    iterator: data,
    properties,
  });
  data = await runCallbacks({ name: '*.create.before', iterator: data, properties });
  // OpenCRUD backwards compatibility
  data = await runCallbacks(
    `${collectionName.toLowerCase()}.new.before`,
    data,
    currentUser
  );
  data = await runCallbacks(`${collectionName.toLowerCase()}.new.sync`, data, currentUser);

  /*

  DB Operation

  */
  data._id = await Connectors.create(collection, data);

  /*

  After

  */
  // note: query for document to get fresh document with collection-hooks effects applied
  let document = await Connectors.get(collection, data._id);
  // new callback API (Oct 2019)
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.create.after`,
    callbacks: get(collection, 'options.callbacks.create.after', []),
    iterator: document,
    properties,
  });
  document = await runCallbacks({
    name: '*.create.after',
    callbacks: get(globalCallbacks, 'create.after', []),
    iterator: document,
    properties,
  });
  // run any post-operation sync callbacks
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.create.after`,
    iterator: document,
    properties,
  });
  document = await runCallbacks({ name: '*.create.after', iterator: document, properties });
  // OpenCRUD backwards compatibility
  document = await runCallbacks(`${collectionName.toLowerCase()}.new.after`, document, currentUser);

  // update document object in properties object
  properties.document = document;

  /*

  Async

  */
  // new callback API (Oct 2019)
  await runCallbacksAsync({
    name: `${typeName.toLowerCase()}.create.async`,
    callbacks: get(collection, 'options.callbacks.create.async', []),
    properties,
  });
  await runCallbacksAsync({
    name: '*.create.async',
    callbacks: get(globalCallbacks, 'create.async', []),
    properties,
  });
  // note: make sure properties.document is up to date
  await runCallbacksAsync({
    name: `${typeName.toLowerCase()}.create.async`,
    properties,
  });
  await runCallbacksAsync({ name: '*.create.async', properties });
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(
    `${collectionName.toLowerCase()}.new.async`,
    document,
    currentUser,
    collection
  );

  if (context.Users) {
    document = context.Users.restrictViewableFields(currentUser, collection, document);
  }

  endDebugMutator(collectionName, 'Create', { document });

  return { data: document };
};

/*

Update

*/
export const updateMutator = async ({
  collection,
  documentId,
  selector,
  data,
  set = {},
  unset = {},
  currentUser,
  validate,
  context = {},
  document: oldDocument,
  contextName,
}) => {
  const { collectionName, typeName } = collection.options;
  const schema = collection.simpleSchema()._schema;

  // get currentUser from context if possible
  if (!currentUser && context.currentUser) {
    currentUser = context.currentUser;
  }

  // OpenCRUD backwards compatibility
  selector = selector || { _id: documentId };
  data = data || modifierToData({ $set: set, $unset: unset });

  startDebugMutator(collectionName, 'Update', { selector, data });

  if (isEmpty(selector)) {
    throw new Error('Selector cannot be empty');
  }

  // get original document from database or arguments
  oldDocument = oldDocument || (await Connectors.get(collection, selector));

  if (!oldDocument) {
    throw new Error(`Could not find document to update for selector: ${JSON.stringify(selector)}`);
  }

  // get a "preview" of the new document
  let document = { ...oldDocument, ...data };
  document = pickBy(document, f => f !== null);

  /*

  Properties

  */
  const properties = {
    data,
    originalData: clone(data),
    oldDocument,
    originalDocument: oldDocument,
    document,
    currentUser,
    collection,
    context,
    schema,
    contextName,
  };

  /*

  Validation

  */
  if (validate) {
    let validationErrors = [];

    validationErrors = validationErrors.concat(validateData(data, document, collection, context, contextName));

    // new callback API (Oct 2019)
    validationErrors = await runCallbacks({
      name: `${typeName.toLowerCase()}.update.validate`,
      callbacks: get(collection, 'options.callbacks.update.validate', []),
      iterator: validationErrors,
      properties,
    });
    validationErrors = await runCallbacks({
      name: '*.update.validate',
      callbacks: get(globalCallbacks, 'update.validate', []),
      iterator: validationErrors,
      properties,
    });
    // old API
    validationErrors = await runCallbacks({
      name: `${typeName.toLowerCase()}.update.validate`,
      iterator: validationErrors,
      properties,
    });
    validationErrors = await runCallbacks({
      name: '*.update.validate',
      iterator: validationErrors,
      properties,
    });
    // OpenCRUD backwards compatibility
    data = modifierToData(
      await runCallbacks(
        `${collectionName.toLowerCase()}.edit.validate`,
        dataToModifier(data),
        document,
        currentUser,
        validationErrors
      )
    );

    if (validationErrors.length) {
      console.log(validationErrors); // eslint-disable-line no-console
      throwError({ id: 'app.validation_error', data: { break: true, errors: validationErrors } });
    }
  }

  /*

  onUpdate

  */
  for (let fieldName of Object.keys(schema)) {
    let autoValue;
    if (schema[fieldName].onUpdate) {
      autoValue = await schema[fieldName].onUpdate(properties); // eslint-disable-line no-await-in-loop
    } else if (schema[fieldName].onEdit) {
      // OpenCRUD backwards compatibility
      // eslint-disable-next-line no-await-in-loop
      autoValue = await schema[fieldName].onEdit(
        dataToModifier(clone(data)),
        oldDocument || document,
        currentUser,
        document
      );
    }
    if (typeof autoValue !== 'undefined') {
      data[fieldName] = autoValue;
    }
  }

  /*

  Before

  */
  // new callback API (Oct 2019)
  data = await runCallbacks({
    name: `${typeName.toLowerCase()}.update.before`,
    callbacks: get(collection, 'options.callbacks.update.before', []),
    iterator: data,
    properties,
  });
  data = await runCallbacks({
    name: '*.update.before',
    callbacks: get(globalCallbacks, 'update.before', []),
    iterator: data,
    properties,
  });
  // old API
  data = await runCallbacks({
    name: `${typeName.toLowerCase()}.update.before`,
    iterator: data,
    properties,
  });
  data = await runCallbacks({ name: '*.update.before', iterator: data, properties });
  // OpenCRUD backwards compatibility
  data = modifierToData(
    await runCallbacks(
      `${collectionName.toLowerCase()}.edit.before`,
      dataToModifier(data),
      document,
      currentUser,
      document
    )
  );
  data = modifierToData(
    await runCallbacks(
      `${collectionName.toLowerCase()}.edit.sync`,
      dataToModifier(data),
      document,
      currentUser,
      document
    )
  );

  // update connector requires a modifier, so get it from data
  const modifier = dataToModifier(data);

  // remove empty modifiers
  if (isEmpty(modifier.$set)) {
    delete modifier.$set;
  }
  if (isEmpty(modifier.$unset)) {
    delete modifier.$unset;
  }

  /*

  DB Operation

  */
  if (!isEmpty(modifier)) {
    // update document
    await Connectors.update(collection, selector, modifier, { removeEmptyStrings: false });

    // get fresh copy of document from db
    document = await Connectors.get(collection, selector);

    // TODO: add support for caching by other indexes to Dataloader
    // https://github.com/VulcanJS/Vulcan/issues/2000
    // clear cache if needed
    if (selector.documentId && collection.loader) {
      collection.loader.clear(selector.documentId);
    }
  }

  /*

  After

  */
  // new callback API (Oct 2019)
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.update.after`,
    callbacks: get(collection, 'options.callbacks.update.after', []),
    iterator: document,
    properties,
  });
  document = await runCallbacks({
    name: '*.update.after',
    callbacks: get(globalCallbacks, 'update.after', []),
    iterator: document,
    properties,
  });
  // old API
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.update.after`,
    iterator: document,
    properties,
  });
  document = await runCallbacks({ name: '*.update.after', iterator: document, properties });
  // OpenCRUD backwards compatibility
  document = await runCallbacks(
    `${collectionName.toLowerCase()}.edit.after`,
    document,
    oldDocument,
    currentUser
  );

  /*

  Async

  */
  // new callback API (Oct 2019)
  await runCallbacksAsync({
    name: `${typeName.toLowerCase()}.update.async`,
    callbacks: get(collection, 'options.callbacks.update.async', []),
    properties,
  });
  await runCallbacksAsync({
    name: '*.update.async',
    callbacks: get(globalCallbacks, 'update.async', []),
    properties,
  });
  // run async callbacks
  await runCallbacksAsync({ name: `${typeName.toLowerCase()}.update.async`, properties });
  await runCallbacksAsync({ name: '*.update.async', properties });
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(
    `${collectionName.toLowerCase()}.edit.async`,
    document,
    oldDocument,
    currentUser,
    collection
  );

  endDebugMutator(collectionName, 'Update', { modifier });

  // filter out non readable fields if appliable
  if (context.Users) {
    document = context.Users.restrictViewableFields(currentUser, collection, document);
  }

  return { data: document };
};

/*

Delete

*/
export const deleteMutator = async ({
  collection,
  documentId,
  selector,
  currentUser,
  validate,
  context = {},
  document,
}) => {
  const { collectionName, typeName } = collection.options;
  const schema = collection.simpleSchema()._schema;

  // get currentUser from context if possible
  if (!currentUser && context.currentUser) {
    currentUser = context.currentUser;
  }

  // OpenCRUD backwards compatibility
  selector = selector || { _id: documentId };

  if (isEmpty(selector)) {
    throw new Error('Selector cannot be empty');
  }

  document = document || (await Connectors.get(collection, selector));

  if (!document) {
    throw new Error(`Could not find document to delete for selector: ${JSON.stringify(selector)}`);
  }

  /*

  Properties

  */
  const properties = { document, currentUser, collection, context, schema };

  /*

  Validation

  */
  if (validate) {
    let validationErrors = [];

    // new API (Oct 2019)
    validationErrors = await runCallbacks({
      name: `${typeName.toLowerCase()}.delete.validate`,
      callbacks: get(collection, 'options.callbacks.delete.validate', []),
      iterator: validationErrors,
      properties,
    });
    validationErrors = await runCallbacks({
      name: '*.delete.validate',
      callbacks: get(globalCallbacks, 'delete.validate', []),
      iterator: validationErrors,
      properties,
    });
    // old API
    validationErrors = await runCallbacks({
      name: `${typeName.toLowerCase()}.delete.validate`,
      iterator: validationErrors,
      properties,
    });
    validationErrors = await runCallbacks({
      name: '*.delete.validate',
      iterator: validationErrors,
      properties,
    });
    // OpenCRUD backwards compatibility
    document = await runCallbacks(
      `${collectionName.toLowerCase()}.remove.validate`,
      document,
      currentUser
    );

    if (validationErrors.length) {
      console.log(validationErrors); // eslint-disable-line no-console
      throwError({ id: 'app.validation_error', data: { break: true, errors: validationErrors } });
    }
  }

  /*

  onDelete

  */
  for (let fieldName of Object.keys(schema)) {
    if (schema[fieldName].onDelete) {
      await schema[fieldName].onDelete(properties); // eslint-disable-line no-await-in-loop
    } else if (schema[fieldName].onRemove) {
      // OpenCRUD backwards compatibility
      await schema[fieldName].onRemove(document, currentUser); // eslint-disable-line no-await-in-loop
    }
  }

  /*

  Before

  */
  // new API (Oct 2019)
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.delete.before`,
    callbacks: get(collection, 'options.callbacks.delete.before', []),
    iterator: document,
    properties,
  });
  document = await runCallbacks({
    name: '*.delete.before',
    callbacks: get(globalCallbacks, 'delete.before', []),
    iterator: document,
    properties,
  });
  // old API
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.delete.before`,
    iterator: document,
    properties,
  });
  document = await runCallbacks({ name: '*.delete.before', iterator: document, properties });
  // OpenCRUD backwards compatibility
  document = await runCallbacks(
    `${collectionName.toLowerCase()}.remove.before`,
    document,
    currentUser
  );
  document = await runCallbacks(
    `${collectionName.toLowerCase()}.remove.sync`,
    document,
    currentUser
  );

  /*

  DB Operation

  */
  await Connectors.delete(collection, selector);

  /*

  After

  */
  // new API (Oct 2019)
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.delete.after`,
    callbacks: get(collection, 'options.callbacks.delete.after', []),
    iterator: document,
    properties,
  });
  document = await runCallbacks({
    name: '*.delete.after',
    callbacks: get(globalCallbacks, 'delete.after', []),
    iterator: document,
    properties,
  });
  // old API
  document = await runCallbacks({
    name: `${typeName.toLowerCase()}.delete.after`,
    iterator: document,
    properties,
  });
  document = await runCallbacks({ name: '*.delete.after', iterator: document, properties });
  // OpenCRUD backwards compatibility
  document = await runCallbacks(
    `${collectionName.toLowerCase()}.remove.after`,
    document,
    currentUser
  );

  // TODO: add support for caching by other indexes to Dataloader
  // clear cache if needed
  if (selector.documentId && collection.loader) {
    collection.loader.clear(selector.documentId);
  }

  /*

  Async

  */
  // new API (Oct 2019)
  await runCallbacksAsync({
    name: `${typeName.toLowerCase()}.delete.async`,
    callbacks: get(collection, 'options.callbacks.delete.async', []),
    properties,
  });
  await runCallbacksAsync({
    name: '*.delete.async',
    callbacks: get(globalCallbacks, 'delete.async', []),
    properties,
  });
  // old API
  await runCallbacksAsync({ name: `${typeName.toLowerCase()}.delete.async`, properties });
  await runCallbacksAsync({ name: '*.delete.async', properties });
  // OpenCRUD backwards compatibility
  await runCallbacksAsync(
    `${collectionName.toLowerCase()}.remove.async`,
    document,
    currentUser,
    collection
  );

  endDebugMutator(collectionName, 'Delete');

  // filter out non readable fields if appliable
  if (context.Users) {
    document = context.Users.restrictViewableFields(currentUser, collection, document);
  }

  return { data: document };
};

// OpenCRUD backwards compatibility
export const newMutation = createMutator;
export const editMutation = updateMutator;
export const removeMutation = deleteMutator;
export const newMutator = createMutator;
export const editMutator = updateMutator;
export const removeMutator = deleteMutator;

const startDebugMutator = (name, action, properties) => {
  debug('');
  debugGroup(`--------------- start \x1b[36m${name} ${action} Mutator\x1b[0m ---------------`);
  Object.keys(properties).forEach(p => {
    debug(`// ${p}: `, properties[p]);
  });
};

const endDebugMutator = (name, action, properties = {}) => {
  Object.keys(properties).forEach(p => {
    debug(`// ${p}: `, properties[p]);
  });
  debugGroupEnd();
  debug(`--------------- end \x1b[36m${name} ${action} Mutator\x1b[0m ---------------`);
  debug('');
};
