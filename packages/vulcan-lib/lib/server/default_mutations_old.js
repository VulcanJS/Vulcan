/*

Default mutations

*/

// import { registerCallback } from '../modules/callbacks.js';
import { createMutator, updateMutator, deleteMutator } from './mutators.js';
import { Utils } from '../modules/utils.js';
import { Connectors } from './connectors.js';
import { generateTypeNameFromCollectionName, getCollection, getCollectionByTypeName } from '../modules/collections.js';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

const defaultOptions = { create: true, update: true, upsert: true, delete: true };

const getCreateMutationName = typeName => `create${typeName}`;
const getUpdateMutationName = typeName => `update${typeName}`;
const getDeleteMutationName = typeName => `delete${typeName}`;
const getUpsertMutationName = typeName => `upsert${typeName}`;
//const getMultiQueryName = (typeName) => `multi${typeName}Query`;

export function getDefaultMutations(options) {
  let typeName, collectionName, mutationOptions;

  if (typeof arguments[0] === 'object') {
    // new single-argument API
    typeName = arguments[0].typeName;
    // collectionName = arguments[0].collectionName || getCollectionByTypeName(typeName).options.collectionName;
    mutationOptions = { ...defaultOptions, ...arguments[0].options };
  } else {
    // OpenCRUD backwards compatibility
    collectionName = arguments[0];
    typeName = generateTypeNameFromCollectionName(collectionName);
    mutationOptions = { ...defaultOptions, ...arguments[1] };
  }

  // register callbacks for documentation purposes
  // registerCollectionCallbacks(typeName, mutationOptions);

  const mutations = {};

  if (mutationOptions.create) {
    // mutation for inserting a new document

    const mutationName = getCreateMutationName(typeName);

    const createMutation = {
      description: `Mutation for creating new ${typeName} documents`,
      name: mutationName,

      // check function called on a user to see if they can perform the operation
      check(user, document, context) {

        collectionName = collectionName || getCollectionByTypeName(typeName).options.collectionName;

        const { Users } = context;

        // new API
        const permissionCheck = get(getCollection(collectionName), 'options.permissions.canCreate');
        if (permissionCheck) {
          return Users.permissionCheck({
            check: permissionCheck,
            user,
            document,
            context,
            collection: context[collectionName],
            operationName: 'create',
          });
        }

        // OpenCRUD backwards compatibility
        const check = mutationOptions.createCheck || mutationOptions.newCheck;
        if (check) {
          return check(user, document);
        }

        // check if they can perform "foo.new" operation (e.g. "movie.new")
        // OpenCRUD backwards compatibility
        return Users.canDo(user, [
          `${typeName.toLowerCase()}.create`,
          `${collectionName.toLowerCase()}.new`,
        ]);
      },

      async mutation(root, args, context) {

        const { input = {}, data: backwardsCompatibilityData } = args;

        const data = input.data || backwardsCompatibilityData;
        
        if (isEmpty(data)) {
          throw new Error(`create${typeName} received empty data object`);
        }

        collectionName = collectionName || getCollectionByTypeName(typeName).options.collectionName;

        const collection = context[collectionName];

        // check if current user can pass check function; else throw error
        Utils.performCheck(
          this.check,
          context.currentUser,
          data,
          context,
          '',
          `${typeName}.create`,
          collectionName
        );

        // pass document to boilerplate newMutator function
        return await createMutator({
          collection,
          data,
          currentUser: context.currentUser,
          validate: true,
          context,
          contextName: input.contextName,
        });
      },
    };
    mutations.create = createMutation;
    // OpenCRUD backwards compatibility
    mutations.new = createMutation;
  }

  if (mutationOptions.update) {
    // mutation for editing a specific document

    const mutationName = getUpdateMutationName(typeName);

    const updateMutation = {
      description: `Mutation for updating a ${typeName} document`,
      name: mutationName,

      // check function called on a user and document to see if they can perform the operation
      check(user, document, context) {

        collectionName = collectionName || getCollectionByTypeName(typeName).options.collectionName;

        const { Users } = context;

        // new API
        const permissionCheck = get(getCollection(collectionName), 'options.permissions.canUpdate');
        if (permissionCheck) {
          return Users.permissionCheck({
            check: permissionCheck,
            user,
            document,
            context,
            collection: context[collectionName],
            operationName: 'update',
          });
        }

        // OpenCRUD backwards compatibility
        const check = mutationOptions.updateCheck || mutationOptions.editCheck;
        if (check) {
          return check(user, document);
        }

        if (!user || !document) return false;
        // check if user owns the document being edited.
        // if they do, check if they can perform "foo.edit.own" action
        // if they don't, check if they can perform "foo.edit.all" action
        // OpenCRUD backwards compatibility
        return (Users.owns(user, document)
          && Users.canDo(user, [
              `${typeName.toLowerCase()}.update.own`,
              `${collectionName.toLowerCase()}.edit.own`,
            ]))
          || Users.canDo(user, [
              `${typeName.toLowerCase()}.update.all`,
              `${collectionName.toLowerCase()}.edit.all`,
            ]);
      },

      async mutation(root, args, context) {

        const { input = {}, selector: oldSelector, data: backwardsCompatibilityData } = args;
        const { filter, id } = input;
        const data = input.data || backwardsCompatibilityData;

        collectionName = collectionName || getCollectionByTypeName(typeName).options.collectionName;

        const collection = context[collectionName];

        // handle both `filter` and `selector` for backwards-compatibility
        let selector;
        if (id) {
          selector = { _id: id };
        } else if (!isEmpty(filter)) {
          const filterParameters = await Connectors.filter(collection, { filter }, context);
          selector = filterParameters.selector;
        } else {
          if (!isEmpty(oldSelector)) {
            selector = oldSelector;
          } else {
            throw new Error('Selector cannot be empty');
          }
        }

        // get entire unmodified document from database
        const document = await Connectors.get(collection, selector);

        if (!document) {
          throw new Error(
            `Could not find document to update for selector: ${JSON.stringify(selector)}`
          );
        }

        // check if user can perform operation; if not throw error
        Utils.performCheck(
          this.check,
          context.currentUser,
          document,
          context,
          document._id,
          `${typeName}.update`,
          collectionName
        );

        // call editMutator boilerplate function
        return await updateMutator({
          collection,
          selector,
          data,
          currentUser: context.currentUser,
          validate: true,
          context,
          document,
          contextName: input.contextName,
        });
      },
    };

    mutations.update = updateMutation;
    // OpenCRUD backwards compatibility
    mutations.edit = updateMutation;
  }
  if (mutationOptions.upsert) {

    // mutation for upserting a specific document
    const mutationName = getUpsertMutationName(typeName);
    mutations.upsert = {
      description: `Mutation for upserting a ${typeName} document`,
      name: mutationName,

      async mutation(root, { filter, selector, data }, context) {

        collectionName = collectionName || getCollectionByTypeName(typeName).options.collectionName;

        const collection = context[collectionName];

        // check if documeet exists already
        const existingDocument = await Connectors.get(collection, selector, {
          fields: { _id: 1 },
        });

        if (existingDocument) {
          return await collection.options.mutations.update.mutation(
            root,
            { filter, selector, data },
            context
          );
        } else {
          return await collection.options.mutations.create.mutation(root, { data }, context);
        }
      },
    };
  }

  if (mutationOptions.delete) {

    // mutation for removing a specific document (same checks as edit mutation)

    const mutationName = getDeleteMutationName(typeName);

    const deleteMutation = {
      description: `Mutation for deleting a ${typeName} document`,
      name: mutationName,

      check(user, document, context) {

        collectionName = collectionName || getCollectionByTypeName(typeName).options.collectionName;

        const { Users } = context;

        // new API
        const permissionCheck = get(getCollection(collectionName), 'options.permissions.canDelete');
        if (permissionCheck) {
          return Users.permissionCheck({
            check: permissionCheck,
            user,
            document,
            context,
            collection: context[collectionName],
            operationName: 'delete',
          });
        }

        // OpenCRUD backwards compatibility
        const check = mutationOptions.deleteCheck || mutationOptions.removeCheck;
        if (check) {
          return check(user, document);
        }

        if (!user || !document) return false;
        // OpenCRUD backwards compatibility
        return (Users.owns(user, document)
          && Users.canDo(user, [
              `${typeName.toLowerCase()}.delete.own`,
              `${collectionName.toLowerCase()}.remove.own`,
            ]))
          || Users.canDo(user, [
              `${typeName.toLowerCase()}.delete.all`,
              `${collectionName.toLowerCase()}.remove.all`,
            ]);
      },

      async mutation(root, args, context) {

        const { input = {}, selector: oldSelector } = args;
        const { filter, id } = input;

        collectionName = collectionName || getCollectionByTypeName(typeName).options.collectionName;

        const collection = context[collectionName];

        // handle both `filter` and `selector` for backwards-compatibility
        let selector;
        if (id) {
          selector = { _id: id };
        } else if (!isEmpty(filter)) {
          const filterParameters = await Connectors.filter(collection, { filter }, context);
          selector = filterParameters.selector;
        } else {
          if (!isEmpty(oldSelector)) {
            selector = oldSelector;
          } else {
            throw new Error('Selector cannot be empty');
          }
        }

        const document = await Connectors.get(collection, selector);

        if (!document) {
          throw new Error(
            `Could not find document to delete for selector: ${JSON.stringify(selector)}`
          );
        }

        Utils.performCheck(
          this.check,
          context.currentUser,
          document,
          context,
          document._id,
          `${typeName}.delete`,
          collectionName
        );

        return await deleteMutator({
          collection,
          selector: { _id: document._id },
          currentUser: context.currentUser,
          validate: true,
          context,
          document,
        });
      },
    };

    mutations.delete = deleteMutation;
    // OpenCRUD backwards compatibility
    mutations.remove = deleteMutation;
  }

  return mutations;
}

// const registerCollectionCallbacks = (typeName, options) => {
//   typeName = typeName.toLowerCase();

//   if (options.create) {
//     registerCallback({
//       name: `${typeName}.create.validate`,
//       iterator: { validationErrors: 'An array that can be used to accumulate validation errors' },
//       properties: [
//         { document: 'The document being inserted' },
//         { currentUser: 'The current user' },
//         { collection: 'The collection the document belongs to' },
//         { context: 'The context of the mutation' },
//       ],
//       runs: 'sync',
//       returns: 'document',
//       description:
//         'Validate a document before insertion (can be skipped when inserting directly on server).',
//     });
//     registerCallback({
//       name: `${typeName}.create.before`,
//       iterator: { document: 'The document being inserted' },
//       properties: [{ currentUser: 'The current user' }],
//       runs: 'sync',
//       returns: 'document',
//       description: "Perform operations on a new document before it's inserted in the database.",
//     });
//     registerCallback({
//       name: `${typeName}.create.after`,
//       iterator: { document: 'The document being inserted' },
//       properties: [{ currentUser: 'The current user' }],
//       runs: 'sync',
//       returns: 'document',
//       description:
//         "Perform operations on a new document after it's inserted in the database but *before* the mutation returns it.",
//     });
//     registerCallback({
//       name: `${typeName}.create.async`,
//       iterator: { document: 'The document being inserted' },
//       properties: [
//         { currentUser: 'The current user' },
//         { collection: 'The collection the document belongs to' },
//       ],
//       runs: 'async',
//       returns: null,
//       description:
//         "Perform operations on a new document after it's inserted in the database asynchronously.",
//     });
//   }
//   if (options.update) {
//     registerCallback({
//       name: `${typeName}.update.validate`,
//       iterator: { validationErrors: 'An object that can be used to accumulate validation errors' },
//       properties: [
//         { document: 'The document being edited' },
//         { data: 'The client data' },
//         { currentUser: 'The current user' },
//         { collection: 'The collection the document belongs to' },
//         { context: 'The context of the mutation' },
//       ],
//       runs: 'sync',
//       returns: 'modifier',
//       description:
//         'Validate a document before update (can be skipped when updating directly on server).',
//     });
//     registerCallback({
//       name: `${typeName}.update.before`,
//       iterator: { data: 'The client data' },
//       properties: [{ document: 'The document being edited' }, { currentUser: 'The current user' }],
//       runs: 'sync',
//       returns: 'modifier',
//       description: "Perform operations on a document before it's updated in the database.",
//     });
//     registerCallback({
//       name: `${typeName}.update.after`,
//       iterator: { newDocument: 'The document after the update' },
//       properties: [{ document: 'The document being edited' }, { currentUser: 'The current user' }],
//       runs: 'sync',
//       returns: 'document',
//       description:
//         "Perform operations on a document after it's updated in the database but *before* the mutation returns it.",
//     });
//     registerCallback({
//       name: `${typeName}.update.async`,
//       iterator: { newDocument: 'The document after the edit' },
//       properties: [
//         { document: 'The document before the edit' },
//         { currentUser: 'The current user' },
//         { collection: 'The collection the document belongs to' },
//       ],
//       runs: 'async',
//       returns: null,
//       description:
//         "Perform operations on a document after it's updated in the database asynchronously.",
//     });
//   }
//   if (options.delete) {
//     registerCallback({
//       name: `${typeName}.delete.validate`,
//       iterator: { validationErrors: 'An object that can be used to accumulate validation errors' },
//       properties: [
//         { currentUser: 'The current user' },
//         { document: 'The document being removed' },
//         { collection: 'The collection the document belongs to' },
//         { context: 'The context of this mutation' },
//       ],
//       runs: 'sync',
//       returns: 'document',
//       description:
//         'Validate a document before removal (can be skipped when removing directly on server).',
//     });
//     registerCallback({
//       name: `${typeName}.delete.before`,
//       iterator: { document: 'The document being removed' },
//       properties: [{ currentUser: 'The current user' }],
//       runs: 'sync',
//       returns: null,
//       description: "Perform operations on a document before it's removed from the database.",
//     });
//     registerCallback({
//       name: `${typeName}.delete.async`,
//       properties: [
//         { document: 'The document being removed' },
//         { currentUser: 'The current user' },
//         { collection: 'The collection the document belongs to' },
//       ],
//       runs: 'async',
//       returns: null,
//       description:
//         "Perform operations on a document after it's removed from the database asynchronously.",
//     });
//   }
// };
