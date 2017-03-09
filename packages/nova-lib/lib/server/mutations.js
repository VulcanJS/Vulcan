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

export const newMutation = ({ collection, document, currentUser, validate, context }) => {

  // console.log("// newMutation")
  // console.log(collection._name)
  // console.log(document)

  // we don't want to modify the original document
  let newDocument = Object.assign({}, document);

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  // if document is not trusted, run validation steps
  if (validate) {

    // check that the current user has permission to insert each field
    _.keys(newDocument).forEach(function (fieldName) {
      var field = schema[fieldName];
      if (!context.Users.canInsertField (currentUser, field)) {
        throw new Error(Utils.encodeIntlError({id: 'app.disallowed_property_detected', value: fieldName}));
      }
    });

    // run validation callbacks
    newDocument = runCallbacks(`${collectionName}.new.validate`, newDocument, currentUser);
  }

  // check if userId field is in the schema and add it to document if needed
  const userIdInSchema = Object.keys(schema).find(key => key === 'userId');
  if (!!userIdInSchema && !newDocument.userId) newDocument.userId = currentUser._id;

  // TODO: find that info in GraphQL mutations
  // if (Meteor.isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders["user-agent"];
  // }

  // run sync callbacks
  newDocument = runCallbacks(`${collectionName}.new.sync`, newDocument, currentUser);

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

export const editMutation = ({ collection, documentId, set, unset, currentUser, validate, context }) => {

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

  // if document is not trusted, run validation steps
  if (validate) {

    // check that the current user has permission to edit each field
    const modifiedProperties = _.keys(set).concat(_.keys(unset));
    modifiedProperties.forEach(function (fieldName) {
      var field = schema[fieldName];
      if (!context.Users.canEditField(currentUser, field, document)) {
        throw new Error(Utils.encodeIntlError({id: 'app.disallowed_property_detected', value: fieldName}));
      }
    });

    // run validation callbacks
    modifier = runCallbacks(`${collectionName}.edit.validate`, modifier, document, currentUser);
  }

  // run sync callbacks (on mongo modifier)
  modifier = runCallbacks(`${collectionName}.edit.sync`, modifier, document, currentUser);

  // update document
  collection.update(documentId, modifier);

  // get fresh copy of document from db
  const newDocument = collection.findOne(documentId);

  // run async callbacks
  runCallbacksAsync(`${collectionName}.edit.async`, newDocument, document, currentUser, collection);

  // console.log("// edit mutation finished")
  // console.log(newDocument)

  return newDocument;
}

export const removeMutation = ({ collection, documentId, currentUser, validate, context }) => {

  // console.log("// removeMutation")
  // console.log(collection._name)
  // console.log(documentId)

  const collectionName = collection._name;

  let document = collection.findOne(documentId);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = runCallbacks(`${collectionName}.remove.validate`, document, currentUser);
  }

  runCallbacks(`${collectionName}.remove.sync`, document, currentUser);

  collection.remove(documentId);

  runCallbacksAsync(`${collectionName}.remove.async`, document, currentUser, collection);

  return document;
}
