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

import { Utils, runCallbacks, runCallbacksAsync } from '../modules/index.js';
import { createError } from 'apollo-errors';

export const newMutation = async ({ collection, document, currentUser, validate, context }) => {

  // console.log("// newMutation")
  // console.log(collection._name)
  // console.log(document)

  // we don't want to modify the original document
  let newDocument = Object.assign({}, document);

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  /*

    If document is not trusted, run validation steps:
  
    1. Check that the current user has permission to insert each field
    2. Check field lengths
    3. Check field types
    4. Check for missing fields
    5. Run SimpleSchema validation step (for now)
    6. Run validation callbacks
    
  */
  if (validate) {

    const validationErrors = [];

    // Check validity of inserted document
    _.forEach(newDocument, (value, fieldName) => {

      const fieldSchema = schema[fieldName];

      // 1. check that the current user has permission to insert each field
      if (!fieldSchema || !context.Users.canInsertField (currentUser, fieldSchema)) {
        validationErrors.push({
          id: 'app.disallowed_property_detected', 
          fieldName
        });
      }

      // 2. check field lengths
      if (fieldSchema.limit && value.length > fieldSchema.limit) {
        validationErrors.push({
          id: 'app.field_is_too_long', 
          data: {fieldName, limit: fieldSchema.limit}
        });
      }

      // 3. check that fields have the proper type
      // TODO

    });

    // 4. check that required fields have a value
    _.keys(schema).forEach(fieldName => {

      const fieldSchema = schema[fieldName];

      
      if ((fieldSchema.required || !fieldSchema.optional) && typeof newDocument[fieldName] === 'undefined') {
        validationErrors.push({
          id: 'app.required_field_missing', 
          data: {fieldName}
        });
      }

    });

    // 5. still run SS validation for now for backwards compatibility
    try {
      collection.simpleSchema().validate(document);
    } catch (error) {
      console.log(error)
      validationErrors.push({
        id: 'app.schema_validation_error',
        data: {message: error.message}
      });
    }

    // run validation callbacks
    newDocument = runCallbacks(`${collectionName}.new.validate`, newDocument, currentUser, validationErrors);
  
    if (validationErrors.length) {
      const NewDocumentValidationError = createError('app.validation_error', {message: 'app.new_document_validation_error'});
      throw new NewDocumentValidationError({data: {break: true, errors: validationErrors}});
    }

  }

  // check if userId field is in the schema and add it to document if needed
  const userIdInSchema = Object.keys(schema).find(key => key === 'userId');
  if (!!userIdInSchema && !newDocument.userId) newDocument.userId = currentUser._id;

  // run onInsert step
  _.keys(schema).forEach(fieldName => {
    if (schema[fieldName].onInsert) {
      const autoValue = schema[fieldName].onInsert(newDocument, currentUser);
      if (autoValue) {
        newDocument[fieldName] = autoValue;
      }
    }
  });

  // TODO: find that info in GraphQL mutations
  // if (Meteor.isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders["user-agent"];
  // }

  // run sync callbacks
  newDocument = await runCallbacks(`${collectionName}.new.sync`, newDocument, currentUser);

  // add _id to document
  newDocument._id = collection.insert(newDocument);

  // get fresh copy of document from db
  const insertedDocument = collection.findOne(newDocument._id);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  runCallbacksAsync(`${collectionName}.new.async`, insertedDocument, currentUser, collection);

  // console.log("// new mutation finished:")
  // console.log(newDocument)

  return newDocument;
}

export const editMutation = async ({ collection, documentId, set, unset, currentUser, validate, context }) => {

  // console.log("// editMutation")
  // console.log(collection._name)
  // console.log(documentId)
  // console.log(set)
  // console.log(unset)

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  // build mongo modifier from arguments
  let modifier = {$set: set, $unset: unset};

  // get original document from database
  let document = collection.findOne(documentId);

  /*

    If document is not trusted, run validation steps:
  
    1. Check that the current user has permission to edit each field
    2. Check field lengths
    3. Check field types
    4. Run SimpleSchema validation step (for now)
    5. Check for missing fields
    6. Run validation callbacks

  */
  if (validate) {

    const validationErrors = [];

    // 1. check that the current user has permission to edit each field
    const modifiedProperties = _.keys(set).concat(_.keys(unset));
    modifiedProperties.forEach(function (fieldName) {
      var field = schema[fieldName];
      if (!field || !context.Users.canEditField(currentUser, field, document)) {
        validationErrors.push({
          id: 'app.disallowed_property_detected', 
          fieldName
        });
      }
    });

    // Check validity of set modifier
    _.forEach(set, (value, fieldName) => {

      const fieldSchema = schema[fieldName];

      // 2. check field lengths
      if (fieldSchema.limit && value.length > fieldSchema.limit) {
        validationErrors.push({
          id: 'app.field_is_too_long', 
          data: {fieldName, limit: fieldSchema.limit}
        });
      }

      // 3. check that fields have the proper type
      // TODO

    });

    // 4. check that required fields have a value
    _.keys(schema).forEach(fieldName => {

      const fieldSchema = schema[fieldName];

      if ((fieldSchema.required || !fieldSchema.optional) && typeof set[fieldName] === 'undefined') {
        validationErrors.push({
          id: 'app.required_field_missing', 
          data: {fieldName}
        });
      }

    });

    // 5. still run SS validation for now for backwards compatibility
    try {
      collection.simpleSchema().validate({$set: set, $unset: unset}, { modifier: true });
    } catch (error) {
      console.log(error)
      validationErrors.push({
        id: 'app.schema_validation_error',
        data: {message: error.message}
      });
    }

    // 6. run validation callbacks
    modifier = runCallbacks(`${collectionName}.edit.validate`, modifier, document, currentUser, validationErrors);

    if (validationErrors.length) {
      const EditDocumentValidationError = createError('app.validation_error', {message: 'app.edit_document_validation_error'});
      throw new EditDocumentValidationError({data: {break: true, errors: validationErrors}});
    }

  }

  // run onEdit step
  _.keys(schema).forEach(fieldName => {

    if (schema[fieldName].onEdit) {
      const autoValue = schema[fieldName].onEdit(modifier, document, currentUser);
      if (typeof autoValue !== 'undefined') {
        if (autoValue === null) {
          // if any autoValue returns null, then unset the field
          modifier.$unset[fieldName] = true;
        } else {
          modifier.$set[fieldName] = autoValue;
        }
      }
    }
  });

  // run sync callbacks (on mongo modifier)
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
  const newDocument = collection.findOne(documentId);

  // clear cache if needed
  if (collection.loader) {
    collection.loader.clear(documentId);
  }

  // run async callbacks
  runCallbacksAsync(`${collectionName}.edit.async`, newDocument, document, currentUser, collection);

  // console.log("// edit mutation finished")
  // console.log(modifier)
  // console.log(newDocument)

  return newDocument;
}

export const removeMutation = async ({ collection, documentId, currentUser, validate, context }) => {

  // console.log("// removeMutation")
  // console.log(collection._name)
  // console.log(documentId)

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  let document = collection.findOne(documentId);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = runCallbacks(`${collectionName}.remove.validate`, document, currentUser);
  }

  // run onRemove step
  _.keys(schema).forEach(fieldName => {
    if (schema[fieldName].onRemove) {
      schema[fieldName].onRemove(document, currentUser);
    }
  });

  await runCallbacks(`${collectionName}.remove.sync`, document, currentUser);

  collection.remove(documentId);

  // clear cache if needed
  if (collection.loader) {
    collection.loader.clear(documentId);
  }

  runCallbacksAsync(`${collectionName}.remove.async`, document, currentUser, collection);

  return document;
}
