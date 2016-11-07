
const newMutation = (collection, document, currentUser) => {
  
  console.log("// newMutation")
  console.log(collection._name)
  console.log(document)

  const collectionName = collection._name;

  // validate document
  collection.simpleSchema().namedContext(`${collectionName}.new`).validate(document);

  // TODO: run method callbacks somewhere else
  // post = Telescope.callbacks.run("posts.new.method", post, Meteor.user());

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

const editMutation = (collection, documentId, set, unset, currentUser) => {

  console.log("// editMutation")
  console.log(collection._name)
  console.log(documentId)
  console.log(set)
  console.log(unset)
  
  const collectionName = collection._name;

  let modifier = {$set: set, $unset: unset};

  // validate modifier
  collection.simpleSchema().namedContext(`${collectionName}.edit`).validate(modifier, {modifier: true});

  // get original document from database
  const document = collection.findOne(documentId);

  // modifier = Telescope.callbacks.run("posts.edit.method", modifier, post, Meteor.user());

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