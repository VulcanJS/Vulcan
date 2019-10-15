/*

Default mutations

*/

import { createMutator, updateMutator, deleteMutator } from './mutators.js';
import { Connectors } from './connectors.js';
import { getCollectionName } from '../modules/collections.js';
import get from 'lodash/get';
import { throwError } from './errors.js';

const defaultOptions = { create: true, update: true, upsert: true, delete: true };

const getCreateMutationName = typeName => `create${typeName}`;
const getUpdateMutationName = typeName => `update${typeName}`;
const getDeleteMutationName = typeName => `delete${typeName}`;
const getUpsertMutationName = typeName => `upsert${typeName}`;

/*

Perform security check before calling mutators

*/
export const performMutationCheck = options => {
  const { user, document, collection, context, operationName } = options;
  const { Users } = context;
  const documentId = document._id;
  const permissionsCheck = get(collection, 'options.permissions.canCreate');
  let allowOperation = false;

  // 1. if no permission has been defined, throw error
  if (!permissionsCheck) {
    throwError({ id: 'app.no_permissions_defined', data: { documentId, operationName } });
  }
  // 2. if no document is passed, throw error
  if (!document) {
    throwError({ id: 'app.document_not_found', data: { documentId, operationName } });
  }

  if (typeof permissionsCheck === 'function') {
    allowOperation = permissionsCheck(options);
  } else if (Array.isArray(permissionsCheck)) {
    allowOperation = Users.isMemberOf(user, permissionsCheck, document);
  }

  // 3. if permission check is defined but fails, disallow operation
  if (!allowOperation) {
    throwError({ id: 'app.operation_not_allowed', data: { documentId, operationName } });
  }
};

/*

Default Mutations

*/
export function getNewDefaultMutations({ typeName, collectionName, options }) {
  collectionName = collectionName || getCollectionName(typeName);
  const mutationOptions = { ...defaultOptions, ...options };

  const mutations = {};

  if (mutationOptions.create) {
    mutations.create = {
      description: `Mutation for creating new ${typeName} documents`,
      name: getCreateMutationName(typeName),
      async mutation(root, { data }, context) {
        const collection = context[collectionName];
        const { currentUser } = context;

        performMutationCheck({
          user: currentUser,
          document: data,
          collection,
          context,
          operationName: `${typeName}.create`,
        });

        return await createMutator({
          collection,
          data,
          currentUser: context.currentUser,
          validate: true,
          context,
        });
      },
    };
  }

  if (mutationOptions.update) {
    mutations.update = {
      description: `Mutation for updating a ${typeName} document`,
      name: getUpdateMutationName(typeName),
      async mutation(root, { where, selector: oldSelector, data }, context) {
        const { currentUser } = context;
        const collection = context[collectionName];

        // handle both `where` and `selector` for backwards-compatibility
        const filterParameters = Connectors.filter(collection, { where }, context);
        const selector = filterParameters.selector;
        // get entire unmodified document from database
        const document = await Connectors.get(collection, selector);

        performMutationCheck({
          user: currentUser,
          document,
          collection,
          context,
          operationName: `${typeName}.update`,
        });

        // call editMutator boilerplate function
        return await updateMutator({
          collection,
          selector,
          data,
          currentUser: context.currentUser,
          validate: true,
          context,
          document,
        });
      },
    };
  }

  if (mutationOptions.upsert) {
    mutations.upsert = {
      description: `Mutation for upserting a ${typeName} document`,
      name: getUpsertMutationName(typeName),
      async mutation(root, { where, selector, data }, context) {
        const collection = context[collectionName];

        // check if document exists already
        const existingDocument = await Connectors.get(collection, selector, {
          fields: { _id: 1 },
        });

        if (existingDocument) {
          return await collection.options.mutations.update.mutation(
            root,
            { where, selector, data },
            context
          );
        } else {
          return await collection.options.mutations.create.mutation(root, { data }, context);
        }
      },
    };
  }

  if (mutationOptions.delete) {
    mutations.delete = {
      description: `Mutation for deleting a ${typeName} document`,
      name: getDeleteMutationName(typeName),
      async mutation(root, { where, selector: oldSelector }, context) {
        const { currentUser } = context;
        const collection = context[collectionName];

        const filterParameters = Connectors.filter(collection, { where }, context);
        const selector = filterParameters.selector;
        const document = await Connectors.get(collection, selector);

        performMutationCheck({
          user: currentUser,
          document,
          collection,
          context,
          operationName: `${typeName}.delete`,
        });

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
  }

  return mutations;
}
