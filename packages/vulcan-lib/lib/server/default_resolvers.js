/*

Default list, single, and total resolvers

*/

import { Utils } from '../modules/utils.js';
import { debug, debugGroup, debugGroupEnd } from '../modules/debug.js';
import { Connectors } from './connectors.js';
import { generateTypeNameFromCollectionName, getTypeNameByCollectionName, getCollectionByTypeName } from '../modules/collections.js';
import { throwError } from './errors.js';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

const defaultOptions = {
  cacheMaxAge: 300,
};

// note: for some reason changing resolverOptions to "options" throws error
export function getDefaultResolvers(options) {
  let typeName, collectionName, resolverOptions;
  if (typeof arguments[0] === 'object') {
    // new single-argument API
    typeName = arguments[0].typeName;
    // collectionName = arguments[0].collectionName || getCollectionByTypeName(typeName).options.collectionName;
    resolverOptions = { ...defaultOptions, ...arguments[0].options };
  } else {
    // OpenCRUD backwards compatibility
    collectionName = arguments[0];
    typeName = generateTypeNameFromCollectionName(collectionName);
    resolverOptions = { ...defaultOptions, ...arguments[1] };
  }

  return {
    // resolver for returning a list of documents based on a set of query terms

    multi: {
      description: `A list of ${typeName} documents matching a set of query terms`,

      async resolver(root, { input = {} }, context, { cacheControl }) {
        const { terms = {}, enableCache = false, enableTotal = true } = input;
        // get currentUser and Users collection from context
        const { currentUser, Users } = context;

        collectionName = getCollectionByTypeName(typeName).options.collectionName;

        debug('');
        debugGroup(`--------------- start \x1b[35m${typeName} Multi Resolver\x1b[0m ---------------`);
        debug(`Options: ${JSON.stringify(resolverOptions)}`);
        debug(`Input: ${JSON.stringify(input)}`);

        if (cacheControl && enableCache ) {
          const maxAge = resolverOptions.cacheMaxAge || defaultOptions.cacheMaxAge;
          cacheControl.setCacheHint({ maxAge });
        }

        // get collection based on collectionName argument
        const collection = context[collectionName];

        // get selector and options from terms and perform Mongo query

        let { selector = {}, options = {}, filteredFields = [] } = isEmpty(terms)
          ? await Connectors.filter(collection, input, context)
          : await collection.getParameters(terms, {}, context);

        // make sure all filtered fields are allowed
        Users.checkFields(currentUser, collection, filteredFields);

        if (!isEmpty(terms)) {
          options.skip = terms.offset;
        }

        // debug({ selector, options });

        const docs = await Connectors.find(collection, selector, options);

        // default to allowing access to all documents
        let viewableDocs = docs;

        // new API (Oct 2019)
        const canRead = get(collection, 'options.permissions.canRead');
        if (canRead) {
          if (typeof canRead === 'function') {
            // if canRead is a function, use it to filter list of documents
            viewableDocs = docs.filter(document => canRead({ user: currentUser, document, context, operationName: 'multi' }));
          } else if (Array.isArray(canRead)) {
            if (canRead.includes('owners')) {
              // if canReady array includes the owners group, test each document
              // to see if it's owned by the current user
              viewableDocs = docs.filter(doc => Users.isMemberOf(currentUser, canRead, doc));
            } else {
              // else, we don't need a per-document check and just allow or disallow
              // access to all documents at once
              viewableDocs = Users.isMemberOf(currentUser, canRead) ? viewableDocs : [];
            }
          }
        } else if (collection.checkAccess) {
          // old API
          // if collection has a checkAccess function defined, remove any documents that doesn't pass the check
          viewableDocs = docs.filter(doc => collection.checkAccess(currentUser, doc));
        }

        // check again that the fields used for filtering were all valid, this time based on documents
        // this second check is necessary for document based permissions like canRead:["owners", customFunctionThatNeedDoc]
        if (filteredFields.length) {
          viewableDocs = viewableDocs.filter(document => Users.canFilterDocument(currentUser, collection, filteredFields, document));
        }

        // take the remaining documents and remove any fields that shouldn't be accessible
        const restrictedDocs = Users.restrictViewableFields(currentUser, collection, viewableDocs);

        // prime the cache
        restrictedDocs.forEach(doc => collection.loader.prime(doc._id, doc));

        debug(`\x1b[33m=> ${restrictedDocs.length} documents returned\x1b[0m`);
        debugGroupEnd();
        debug(`--------------- end \x1b[35m${typeName} Multi Resolver\x1b[0m ---------------`);
        debug('');

        const data = { results: restrictedDocs };

        if (enableTotal) {
          // get total count of documents matching the selector
          data.totalCount = await Connectors.count(collection, selector);
        } else {
          data.totalCount = null;
        }

        // return results
        return data;
      },
    },

    // resolver for returning a single document queried based on id or slug

    single: {
      description: `A single ${typeName} document fetched by ID or slug`,

      async resolver(root, { input = {} }, context, { cacheControl }) {
        const { selector: oldSelector = {}, enableCache = false, allowNull = false } = input;

        collectionName = getCollectionByTypeName(typeName).options.collectionName;

        let doc;

        debug('');
        debugGroup(`--------------- start \x1b[35m${typeName} Single Resolver\x1b[0m ---------------`);
        debug(`Options: ${JSON.stringify(resolverOptions)}`);
        debug(`Input: ${JSON.stringify(input)}`);

        if (cacheControl && enableCache) {
          const maxAge = resolverOptions.cacheMaxAge || defaultOptions.cacheMaxAge;
          cacheControl.setCacheHint({ maxAge });
        }

        const { currentUser, Users } = context;
        const collection = context[collectionName];

        // use Dataloader if doc is selected by documentId/_id
        const documentId = oldSelector.documentId || oldSelector._id || input.id;
        const slug = oldSelector.slug;

        if (documentId) {
          doc = await collection.loader.load(documentId);
        } else if (slug) {
          // make an exception for slug
          doc = await Connectors.get(collection, { slug });
        } else {

          if (isEmpty(input)) {
            throwError({
              id: 'app.empty_input'
            });
          }

          let { selector, options, filteredFields } = await Connectors.filter(collection, input, context);

          // make sure all filtered fields are allowed
          Users.checkFields(currentUser, collection, filteredFields);

          doc = await Connectors.get(collection, selector, options);

          // check again that the fields used for filtering were all valid, this time based on retrieved document
          // this second check is necessary for document based permissions like canRead:["owners", customFunctionThatNeedDoc]
          Users.checkFields(currentUser, collection, filteredFields, doc);
        }

        if (!doc) {
          if (allowNull) {
            return { result: null };
          } else {
            throwError({
              id: 'app.missing_document',
              data: { input, collectionName },
            });
          }
        }

        // if collection has a checkAccess function defined, use it to perform a check on the current document
        // (will throw an error if check doesn't pass)
        let canReadFunction;

        // new API (Oct 2019)
        const canRead = get(collection, 'options.permissions.canRead');
        if (canRead) {
          if (typeof canRead === 'function') {
            // if canRead is a function, use it to check current document
            canReadFunction = (user, document, context) => canRead({ user, document, context, operationName: 'single' });
          } else if (Array.isArray(canRead)) {
            // else if it's an array of groups, check if current user belongs to them
            // for the current document
            canReadFunction = (currentUser, doc) => Users.isMemberOf(currentUser, canRead, doc);
          }
        } else if (collection.checkAccess) {
          // old API
          canReadFunction = collection.checkAccess;
        } else {
          // default to allowing access to all documents
          canReadFunction = () => true;
        }

        Utils.performCheck(canReadFunction, currentUser, doc, collection, documentId, `${typeName}.read.single`, collectionName);

        const restrictedDoc = Users.restrictViewableFields(currentUser, collection, doc);

        debugGroupEnd();
        debug(`--------------- end \x1b[35m${typeName} Single Resolver\x1b[0m ---------------`);
        debug('');

        // filter out disallowed properties and return resulting document
        return { result: restrictedDoc };
      },
    },
  };
}
