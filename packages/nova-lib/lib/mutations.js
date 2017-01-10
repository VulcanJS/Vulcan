/*

Mutations have four steps:

1. Validation

If the mutation call is not trusted (i.e. it comes from a GraphQL mutation), 
we'll run all validate steps:

- Check that the current user has permission to insert/edit each field.
- Validate document against collection schema.
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

import { runCallbacks, runCallbacksAsync } from './callbacks.js';

export const newMutation = ({ collection, document, currentUser, validate, context }) => {
  
  console.log("// newMutation")
  console.log(collection._name)
  console.log(document)

  const collectionName = collection._name;
  const schema = collection.simpleSchema()._schema;

  // if document is not trusted, run validation steps
  if (validate) {

    // check that the current user has permission to insert each field
    _.keys(document).forEach(function (fieldName) {
      var field = schema[fieldName];
      if (!context.Users.canInsertField (currentUser, field)) {
        throw new Meteor.Error('disallowed_property', `disallowed_property_detected: ${fieldName}`);
      }
    });

    // validate document against schema
    collection.simpleSchema().namedContext(`${collectionName}.new`).validate(document);

    // run validation callbacks
    document = runCallbacks(`${collectionName}.new.validate`, document, currentUser);
  }

  // check if userId field is in the schema and add it to document if needed
  const userIdInSchema = Object.keys(schema).find(key => key === 'userId');
  if (!!userIdInSchema && !document.userId) document.userId = currentUser._id;

  // TODO: find that info in GraphQL mutations
  // if (Meteor.isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders["user-agent"];
  // }

  // run sync callbacks
  document = runCallbacks(`${collectionName}.new.sync`, document, currentUser);

  // add _id to document
  document._id = collection.insert({...document}); // use {...document} to "enable" Object.prototype (see https://cl.ly/1N1m2d0y3u1A)

  // get fresh copy of document from db
  const newDocument = collection.findOne(document._id);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  runCallbacksAsync(`${collectionName}.new.async`, newDocument, currentUser);

  console.log("// new mutation finished:")
  console.log(newDocument)
  return document;
}

export const editMutation = ({ collection, documentId, set, unset, currentUser, validate, context }) => {

  console.log("// editMutation")
  console.log(collection._name)
  console.log(documentId)
  console.log(set)
  console.log(unset)
  
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
        throw new Meteor.Error('disallowed_property', `disallowed_property_detected: ${fieldName}`);
      }
    });

    // validate modifier against schema
    collection.simpleSchema().namedContext(`${collectionName}.edit`).validate(modifier, {modifier: true});

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
  runCallbacksAsync(`${collectionName}.edit.async`, newDocument, document, currentUser);

  console.log("// edit mutation finished")
  console.log(newDocument)

  return newDocument;
}

export const removeMutation = ({ collection, documentId, currentUser, validate, context }) => {

  console.log("// removeMutation")
  console.log(collection._name)
  console.log(documentId)

  const collectionName = collection._name;

  let document = collection.findOne(documentId);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = runCallbacks(`${collectionName}.remove.validate`, document, currentUser);
  }

  runCallbacks(`${collectionName}.remove.sync`, document, currentUser);

  collection.remove(documentId);

  runCallbacksAsync(`${collectionName}.remove.async`, document, currentUser);

  return document;
}
