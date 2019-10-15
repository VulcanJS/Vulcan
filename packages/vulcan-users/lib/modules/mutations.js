import { createMutator, updateMutator, deleteMutator, Utils, Connectors, registerCallback } from 'meteor/vulcan:lib';
import Users from './collection'; // TODO: circular dependency?
import isEmpty from 'lodash/isEmpty';

const performCheck = (mutation, user, document) => {
  if (!mutation.check(user, document))
    throw new Error(
      Utils.encodeIntlError({ id: 'app.mutation_not_allowed', value: `"${mutation.name}" on _id "${document._id}"` })
    );
};

const createMutation = {
  name: 'createUser',

  check(user, document) {
    if (!user) return false;
    // OpenCRUD backwards compatibility
    return Users.canDo(user, ['user.create', 'users.new']);
  },

  mutation(root, { data }, context) {
    const { Users, currentUser } = context;
    performCheck(this, currentUser, data);

    return createMutator({
      collection: Users,
      data,
      currentUser,
      validate: true,
      context,
    });
  },
};

const updateMutation = {
  name: 'updateUser',

  check(user, document) {
    if (!user || !document) return false;
    // OpenCRUD backwards compatibility
    return Users.owns(user, document) ? Users.canDo(user, ['user.update.own', 'users.edit.own']) : Users.canDo(user, ['user.update.all', 'users.edit.all']);
  },

  async mutation(root, { selector, data }, context) {
    const { Users, currentUser } = context;

    const document = await Connectors.get(Users, selector);

    if (!document) {
      throw new Error(`Could not find document to update for selector: ${JSON.stringify(selector)}`);
    }

    performCheck(this, currentUser, document);

    return updateMutator({
      collection: Users,
      selector,
      data,
      currentUser,
      validate: true,
      context,
    });
  },
};

const deleteMutation = {
  name: 'deleteUser',

  check(user, document) {
    if (!user || !document) return false;
    // OpenCRUD backwards compatibility
    return Users.owns(user, document) ? Users.canDo(user, ['user.delete.own', 'users.remove.own']) : Users.canDo(user, ['user.delete.all', 'users.remove.all']);
  },

  async mutation(root, { selector }, context) {

    const { Users, currentUser } = context;
    if (isEmpty(selector) || (!selector._id && !selector.documentId && !selector.slug)) {
      throw new Error('Selector cannot be empty');
    }
    const document = await Connectors.get(Users, selector);

    if (!document) {
      throw new Error(`Could not find document to delete for selector: ${JSON.stringify(selector)}`);
    }

    performCheck(this, currentUser, document);

    return deleteMutator({
      collection: Users,
      selector: { _id: document._id },
      currentUser,
      validate: true,
      context,
    });
  },
};
const mutations = {
  create: createMutation,
  update: updateMutation,
  delete: deleteMutation,

  // OpenCRUD backwards compatibility

  new: createMutation,
  edit: updateMutation,
  remove: deleteMutation,
};

export default mutations;

registerCallback({
  name: 'user.create.validate',
  iterator: { document: 'the document being inserted' },
  properties: [
    { document: 'The document being inserted' },
    { currentUser: 'The current user' },
    { validationErrors: 'An object that can be used to accumulate validation errors' },
  ],
  runs: 'sync',
  returns: 'document',
  description: 'Validate a document before insertion (can be skipped when inserting directly on server).',
});
registerCallback({
  name: 'user.create.before',
  iterator: { document: 'the document being inserted' },
  properties: [
    { document: 'The document being inserted' },
    { currentUser: 'The current user' },
    { validationErrors: 'An object that can be used to accumulate validation errors' },
  ],
  runs: 'sync',
  returns: 'document',
  description: 'Perform operations on a new document before it\'s inserted in the database.',
});
registerCallback({
  name: 'user.create.after',
  iterator: { document: 'the document after being inserted in the database' },
  properties: [
    { currentUser: 'The current user' },
  ],
  runs: 'sync',
  returns: 'document',
  description: 'Perform operations on a new document after it\'s inserted in the database but *before* the mutation returns it.',
});
registerCallback({
  name: 'user.create.async',
  iterator: { document: 'The document being inserted' },
  properties: [
    { data: 'The document being inserted' }, //for backward compatibility
    { collection: 'The Users collection' }
  ],
  runs: 'async',
  returns: null,
  description: 'Perform operations on a new user after it\'s inserted in the database asynchronously.',
});
registerCallback({
  name: 'user.update.validate',
  iterator: { data: 'The client data' },
  properties: [
    { document: 'The document being updated' },
    { currentUser: 'The current user.' },
    { validationErrors: 'an object that can be used to accumulate validation errors.' },
  ],
  runs: 'sync',
  description: 'Validate a document before update (can be skipped when updating directly on server).'
});
registerCallback({
  name: 'user.update.before',
  iterator: { data: 'The client data' },
  properties: [
    { document: 'The document being edited' },
    { currentUser: 'The current user' },
    { newDocument: 'A preview of the future document' },
  ],
  runs: 'sync',
  description: 'Perform operations on a document before it\'s updated on the database.',
});
registerCallback({
  name: 'user.update.after',
  iterator: { newdocument: 'The document after the update' },
  properties: [
    { document: 'The document before the update' },
    { currentUser: 'The current user' },
  ],
  runs: 'sync',
  description: 'Perform operations on a document after it\'s updated in the database but *before* the mutation returns it.'
});
registerCallback({
  name: 'user.update.async',
  properties: [
    { newDocument: 'The document after the update' },
    { document: 'The document before the update' },
    { currentUser: 'The current user' },
    { collection: 'The Users collection' },
  ],
  runs: 'async',
  description: 'Perform operations on a document after it\'s updated in the database asynchronously.'
});
registerCallback({
  name: 'user.delete.validate',
  iterator: { document: 'The document being deleted' },
  properties: [
    { currentUser: 'The current user' },
  ],
  runs: 'sync',
  description: 'Validate a document before deletion (can be skipped when deleting directly on the server)'
});
registerCallback({
  name: 'user.delete.before',
  iterator: { document: 'The document being deleted' },
  properties: [
    { currentUser: 'The current user' },
  ],
  runs: 'sync',
  description: 'Perform operations on a document before it\'s deleted from the database',
});
registerCallback({
  name: 'user.delete.async',
  properties: [
    { document: 'The document being deleted' },
    { currentUser: 'The current user' },
    { collection: 'The Users collection' },
  ],
  runs: 'async',
  description: 'Perform operations on a document after it\'s deleted from the database asynchronously.'
});
