/*

Default mutations

*/

import { registerCallback, createMutator, updateMutator, deleteMutator, Utils, Connectors } from 'meteor/vulcan:lib';
import Users from 'meteor/vulcan:users';

export const getDefaultMutations = (typeName, options = { create: true, update: true, upsert: true, delete: true }) => {
  // register callbacks for documentation purposes
  registerCollectionCallbacks(typeName);

  const mutations = {};

  if (options.create) {
    // mutation for inserting a new document

    const createMutation = {
      description: `Mutation for creating new ${typeName} documents`,

      // check function called on a user to see if they can perform the operation
      check(user, document) {
        // OpenCRUD backwards compatibility
        const check = options.createCheck || options.newCheck;
        if (check) {
          return check(user, document);
        }
        // check if they can perform "foo.new" operation (e.g. "movies.new")
        // OpenCRUD backwards compatibility
        return Users.canDo(user, [`${typeName.toLowerCase()}.create`, `${typeName.toLowerCase()}.new`]);
      },

      async mutation(root, { input }, context) {
        const { data } = input;
        const collection = context[typeName];

        // check if current user can pass check function; else throw error
        Utils.performCheck(this.check, context.currentUser, data);

        // pass document to boilerplate newMutator function
        return await createMutator({
          collection,
          data,
          currentUser: context.currentUser,
          validate: true,
          context,
        });
      },
    };
    mutations.create = createMutation;
    // OpenCRUD backwards compatibility
    mutations.new = createMutation;
  }

  if (options.update) {
    // mutation for editing a specific document

    const updateMutation = {
      description: `Mutation for updating a ${typeName} document`,

      // check function called on a user and document to see if they can perform the operation
      check(user, document) {
        // OpenCRUD backwards compatibility
        const check = options.updateCheck || options.editCheck;
        if (check) {
          return check(user, document);
        }

        if (!user || !document) return false;
        // check if user owns the document being edited.
        // if they do, check if they can perform "foo.edit.own" action
        // if they don't, check if they can perform "foo.edit.all" action
        // OpenCRUD backwards compatibility
        return Users.owns(user, document)
          ? Users.canDo(user, [`${typeName.toLowerCase()}.update.own`, `${typeName.toLowerCase()}.edit.own`])
          : Users.canDo(user, [`${typeName.toLowerCase()}.update.all`, `${typeName.toLowerCase()}.edit.all`]);
      },

      async mutation(root, { input }, context) {
        const { selector, data } = input;
        const collection = context[typeName];

        // get entire unmodified document from database
        const document = await Connectors.get(collection, selector);

        // check if user can perform operation; if not throw error
        Utils.performCheck(this.check, context.currentUser, document);

        // call editMutator boilerplate function
        return await updateMutator({
          collection,
          selector,
          data,
          currentUser: context.currentUser,
          validate: true,
          context,
        });
      },
    };
    mutations.update = updateMutation;
    // OpenCRUD backwards compatibility
    mutations.edit = updateMutation;
  }
  if (options.upsert) {
    // mutation for upserting a specific document
    mutations.upsert = {
      description: `Mutation for upserting a ${typeName} document`,

      async mutation(root, { input }, context) {
        const { selector, data } = input;
        const collection = context[typeName];

        // check if document exists already
        const existingDocument = await Connectors.get(collection, selector, { fields: { _id: 1 } });

        if (existingDocument) {
          return await collection.options.mutations.update.mutation(root, { selector, data }, context);
        } else {
          return await collection.options.mutations.create.mutation(root, { data }, context);
        }
      },
    };
  }
  if (options.delete) {
    // mutation for removing a specific document (same checks as edit mutation)

    const deleteMutation = {
      description: `Mutation for deleting a ${typeName} document`,

      check(user, document) {
        // OpenCRUD backwards compatibility
        const check = options.deleteCheck || options.removeCheck;
        if (check) {
          return check(user, document);
        }

        if (!user || !document) return false;
        // OpenCRUD backwards compatibility
        return Users.owns(user, document)
          ? Users.canDo(user, [`${typeName.toLowerCase()}.delete.own`, `${typeName.toLowerCase()}.remove.own`])
          : Users.canDo(user, [`${typeName.toLowerCase()}.delete.all`,  `${typeName.toLowerCase()}.remove.all`]);
      },

      async mutation(root, { input }, context) {
        const { selector } = input;
        const collection = context[typeName];

        const document = await Connectors.get(collection, selector);
        Utils.performCheck(this.check, context.currentUser, document, context);

        return await deleteMutator({
          collection,
          selector,
          currentUser: context.currentUser,
          validate: true,
          context,
        });
      },
    };

    mutations.delete = deleteMutation;
    // OpenCRUD backwards compatibility
    mutations.remove = deleteMutation;
  }

  return mutations;
};

const registerCollectionCallbacks = collectionName => {
  collectionName = collectionName.toLowerCase();

  registerCallback({
    name: `${collectionName}.create.validate`,
    arguments: [
      { document: 'The document being inserted' },
      { currentUser: 'The current user' },
      { validationErrors: 'An object that can be used to accumulate validation errors' },
    ],
    runs: 'sync',
    returns: 'document',
    description: `Validate a document before insertion (can be skipped when inserting directly on server).`,
  });
  registerCallback({
    name: `${collectionName}.create.before`,
    arguments: [{ document: 'The document being inserted' }, { currentUser: 'The current user' }],
    runs: 'sync',
    returns: 'document',
    description: `Perform operations on a new document before it's inserted in the database.`,
  });
  registerCallback({
    name: `${collectionName}.create.after`,
    arguments: [{ document: 'The document being inserted' }, { currentUser: 'The current user' }],
    runs: 'sync',
    returns: 'document',
    description: `Perform operations on a new document after it's inserted in the database but *before* the mutation returns it.`,
  });
  registerCallback({
    name: `${collectionName}.create.async`,
    arguments: [
      { document: 'The document being inserted' },
      { currentUser: 'The current user' },
      { collection: 'The collection the document belongs to' },
    ],
    runs: 'async',
    returns: null,
    description: `Perform operations on a new document after it's inserted in the database asynchronously.`,
  });

  registerCallback({
    name: `${collectionName}.update.validate`,
    arguments: [
      { modifier: 'The MongoDB modifier' },
      { document: 'The document being edited' },
      { currentUser: 'The current user' },
      { validationErrors: 'An object that can be used to accumulate validation errors' },
    ],
    runs: 'sync',
    returns: 'modifier',
    description: `Validate a document before update (can be skipped when updating directly on server).`,
  });
  registerCallback({
    name: `${collectionName}.update.before`,
    arguments: [
      { modifier: 'The MongoDB modifier' },
      { document: 'The document being edited' },
      { currentUser: 'The current user' },
    ],
    runs: 'sync',
    returns: 'modifier',
    description: `Perform operations on a document before it's updated in the database.`,
  });
  registerCallback({
    name: `${collectionName}.update.after`,
    arguments: [
      { modifier: 'The MongoDB modifier' },
      { document: 'The document being edited' },
      { currentUser: 'The current user' },
    ],
    runs: 'sync',
    returns: 'document',
    description: `Perform operations on a document after it's updated in the database but *before* the mutation returns it.`,
  });
  registerCallback({
    name: `${collectionName}.update.async`,
    arguments: [
      { newDocument: 'The document after the edit' },
      { document: 'The document before the edit' },
      { currentUser: 'The current user' },
      { collection: 'The collection the document belongs to' },
    ],
    runs: 'async',
    returns: null,
    description: `Perform operations on a document after it's updated in the database asynchronously.`,
  });

  registerCallback({
    name: `${collectionName}.delete.validate`,
    arguments: [
      { document: 'The document being removed' },
      { currentUser: 'The current user' },
      { validationErrors: 'An object that can be used to accumulate validation errors' },
    ],
    runs: 'sync',
    returns: 'document',
    description: `Validate a document before removal (can be skipped when removing directly on server).`,
  });
  registerCallback({
    name: `${collectionName}.delete.before`,
    arguments: [{ document: 'The document being removed' }, { currentUser: 'The current user' }],
    runs: 'sync',
    returns: null,
    description: `Perform operations on a document before it's removed from the database.`,
  });
  registerCallback({
    name: `${collectionName}.delete.async`,
    arguments: [
      { document: 'The document being removed' },
      { currentUser: 'The current user' },
      { collection: 'The collection the document belongs to' },
    ],
    runs: 'async',
    returns: null,
    description: `Perform operations on a document after it's removed from the database asynchronously.`,
  });
};
