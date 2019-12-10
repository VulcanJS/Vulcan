/*

Default mutations

*/

import { createMutator, updateMutator, deleteMutator } from './mutators.js';
import { Connectors } from './connectors.js';
import { getCollectionByTypeName } from '../modules/collections.js';
import get from 'lodash/get';
import { throwError } from './errors.js';

const defaultOptions = { create: true, update: true, upsert: true, delete: true };

const getCreateMutationName = typeName => `create${typeName}`;
const getUpdateMutationName = typeName => `update${typeName}`;
const getDeleteMutationName = typeName => `delete${typeName}`;
const getUpsertMutationName = typeName => `upsert${typeName}`;

const operationChecks = {
  create: 'canCreate',
  update: 'canUpdate',
  delete: 'canDelete',
};

/*

Perform security check before calling mutators

*/
export const performMutationCheck = options => {
  const { user, document, collection, context, typeName, operationName } = options;
  const { Users } = context;
  const documentId = document._id;
  const permissionsCheck = get(collection, `options.permissions.${operationChecks[operationName]}`);
  let allowOperation = false;
  const fullOperationName = `${typeName}:${operationName}`;
  const data = { documentId, operationName: fullOperationName };

  // 1. if no permission has been defined, throw error
  if (!permissionsCheck) {
    throwError({ id: 'app.no_permissions_defined', data });
  }
  // 2. if no document is passed, throw error
  if (!document) {
    throwError({ id: 'app.document_not_found', data });
  }

  if (typeof permissionsCheck === 'function') {
    allowOperation = permissionsCheck(options);
  } else if (Array.isArray(permissionsCheck)) {
    allowOperation = Users.isMemberOf(user, permissionsCheck, document);
  }

  // 3. if permission check is defined but fails, disallow operation
  if (!allowOperation) {
    throwError({ id: 'app.operation_not_allowed', data });
  }
};

/*

Default Mutations

*/
export function getNewDefaultMutations({ typeName, collectionName, options }) {
  collectionName = collectionName || getCollectionByTypeName(typeName);
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
          typeName,
          operationName: 'create',
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

  // get a single document based on the mutation params
  const getMutationDocument = async ({ input, _id, collection }) => {
    let document;
    let selector;
    if (_id) { // _id bypass input
      document = await collection.loader.load(_id);
    } else {
      const filterParameters = await Connectors.filter(collection, input, context);
      selector = filterParameters.selector;
      // get entire unmodified document from database
      document = await Connectors.get(collection, selector);
    }
    return { selector, document };
  };

  if (mutationOptions.update) {
    mutations.update = {
      description: `Mutation for updating a ${typeName} document`,
      name: getUpdateMutationName(typeName),
      async mutation(root, { input, _id: argsId, selector: oldSelector, data }, context) {
        const { currentUser } = context;
        const collection = context[collectionName];
        const _id = argsId || (data && typeof data === 'object' && data._id); // use provided id or documentId if available

        const { document, selector } = await getMutationDocument({ input, _id, collection });

        performMutationCheck({
          user: currentUser,
          document,
          collection,
          context,
          operationName: 'update',
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
      async mutation(root, { input, _id: argsId, data }, context) {
        const collection = context[collectionName];
        const _id = argsId || (data && typeof data === 'object' && data._id); // use provided id or documentId if available

        // check if document exists already
        const { document: existingDocument, selector } = await getMutationDocument({ input, _id, collection });

        if (existingDocument) {
          return await collection.options.mutations.update.mutation(
            root,
            { input, _id, selector, data },
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
      async mutation(root, { input, _id }, context) {
        const { currentUser } = context;
        const collection = context[collectionName];

        const { document, /*selector*/ } = await getMutationDocument({ input, _id, collection });

        performMutationCheck({
          user: currentUser,
          document,
          collection,
          context,
          operationName: 'delete',
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
