
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
  document._id = collection.insert(document);

  // run async callbacks
  // note: query for document to get fresh document with collection-hooks effects applied
  Telescope.callbacks.runAsync(`${collectionName}.new.async`, collection.findOne(document._id));

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
  modifier = Telescope.callbacks.run(`${collectionName}.edit.sync`, modifier, document);

  // update document
  collection.update(documentId, modifier);

  // get fresh copy of document from db
  const newDocument = collection.findOne(documentId);

  // run async callbacks
  Telescope.callbacks.runAsync(`${collectionName}.edit.async`, newDocument, document);

  return newDocument;
}

const removeMutation = (collection, documentId, currentUser) => {

  console.log("// editMutation")
  console.log(collection._name)
  console.log(documentId)

}

export {newMutation, editMutation, removeMutation};