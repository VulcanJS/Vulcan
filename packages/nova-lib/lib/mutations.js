/*

Mutations have four steps:

1. Validation

If the mutation call is not trusted (i.e. it comes from a GraphQL mutation), 
we'll run all validate callbacks. In any case, we'll also validate the 
arguments against our schema.

2. Sync Callbacks

The second step is to run the mutation argument through all the sync callbacks. 

3. Operation

We then perform the insert/update/remove operation.

4. Async Callbacks

Finally, *after* the operation is performed, we execute any async callbacks. 
Being async, they won't hold up the mutation and slow down its response time
to the client. 

*/


const newMutation = ({ collection, document, currentUser, validate }) => {
  
  console.log("// newMutation")
  console.log(collection._name)
  console.log(document)

  const collectionName = collection._name;

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = Telescope.callbacks.run(`${collectionName}.new.validate`, document, currentUser);
  }

  // validate document against schema
  collection.simpleSchema().namedContext(`${collectionName}.new`).validate(document);

  // TODO: find that info in GraphQL mutations
  // if (Meteor.isServer && this.connection) {
  //   post.userIP = this.connection.clientAddress;
  //   post.userAgent = this.connection.httpHeaders["user-agent"];
  // }

  // run sync callbacks
  document = Telescope.callbacks.run(`${collectionName}.new.sync`, document, currentUser);

  // add _id to document
  const documentId = collection.insert(document);

  // get fresh copy of document from db
  const newDocument = collection.findOne(documentId);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  Telescope.callbacks.runAsync(`${collectionName}.new.async`, newDocument, currentUser);

  return document;
}

const editMutation = ({ collection, documentId, set, unset, currentUser, validate }) => {

  console.log("// editMutation")
  console.log(collection._name)
  console.log(documentId)
  console.log(set)
  console.log(unset)
  
  const collectionName = collection._name;

  // build mongo modifier from arguments
  let modifier = {$set: set, $unset: unset};

  // get original document from database
  let document = collection.findOne(documentId);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = Telescope.callbacks.run(`${collectionName}.edit.validate`, modifier, document, currentUser);
  }

  // validate modifier against schema
  collection.simpleSchema().namedContext(`${collectionName}.edit`).validate(modifier, {modifier: true});

  // run sync callbacks (on mongo modifier)
  modifier = Telescope.callbacks.run(`${collectionName}.edit.sync`, modifier, document, currentUser);

  // update document
  collection.update(documentId, modifier);

  // get fresh copy of document from db
  const newDocument = collection.findOne(documentId);

  // run async callbacks
  Telescope.callbacks.runAsync(`${collectionName}.edit.async`, newDocument, document, currentUser);

  return newDocument;
}

const removeMutation = ({ collection, documentId, currentUser, validate }) => {

  console.log("// removeMutation")
  console.log(collection._name)
  console.log(documentId)

  const collectionName = collection._name;

  let document = collection.findOne(documentId);

  // if document is not trusted, run validation callbacks
  if (validate) {
    document = Telescope.callbacks.run(`${collectionName}.remove.validate`, document, currentUser);
  }

  Telescope.callbacks.run(`${collectionName}.remove.sync`, document, currentUser);

  collection.remove(documentId);

  Telescope.callbacks.runAsync(`${collectionName}.remove.async`, document, currentUser);
}

export {newMutation, editMutation, removeMutation};