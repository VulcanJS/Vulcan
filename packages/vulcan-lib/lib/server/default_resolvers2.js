/*

Default list, single, and total resolvers

*/

import { debug, debugGroup, debugGroupEnd } from '../modules/debug.js';
import { Connectors } from './connectors.js';
import { getCollectionByTypeName } from '../modules/collections.js';
import { throwError } from './errors.js';
import get from 'lodash/get';

const defaultOptions = {
  cacheMaxAge: 300,
};

// note: for some reason changing resolverOptions to "options" throws error
export function getNewDefaultResolvers({ typeName, collectionName, options }) {
  collectionName = collectionName || getCollectionByTypeName(typeName);
  const resolverOptions = { ...defaultOptions, ...options };

  return {
    // resolver for returning a list of documents based on a set of query terms

    multi: {
      description: `A list of ${typeName} documents matching a set of query terms`,

      async resolver(root, { input = {} }, context, { cacheControl }) {
        const { terms = {}, enableCache = false, enableTotal = true } = input;
        const operationName = `${typeName}.read.multi`;

        debug('');
        debugGroup(`--------------- start \x1b[35m${typeName} Multi Resolver\x1b[0m ---------------`);
        debug(`Options: ${JSON.stringify(resolverOptions)}`);
        debug(`Terms: ${JSON.stringify(terms)}`);

        if (cacheControl && enableCache) {
          const maxAge = resolverOptions.cacheMaxAge || defaultOptions.cacheMaxAge;
          cacheControl.setCacheHint({ maxAge });
        }

        // get currentUser and Users collection from context
        const { currentUser, Users } = context;

        // get collection based on collectionName argument
        const collection = context[collectionName];

        // get selector and options from terms and perform Mongo query

        let { selector, options } = await Connectors.filter(collection, input, context);
        const filteredFields = Object.keys(selector);

        // make sure all filtered fields are allowed, before fetching the document
        // (ignore ambiguous field that will need the document to be checked)
        Users.checkFields(currentUser, collection, filteredFields);

        options.skip = terms.offset;

        debug({ selector, options });

        const docs = await Connectors.find(collection, selector, options);
        // in restrictViewableFields, null value will return {} instead of [] (because it works both for array and single doc)
        let viewableDocs = [];

        // check again if all fields used for filtering were actually allowed, this time based on actually retrieved documents

        // new API (Oct 2019)
        const canRead = get(collection, 'options.permissions.canRead');
        if (canRead) {
          if (typeof canRead === 'function') {
            // if canRead is a function, use it to filter list of documents
            viewableDocs = docs.filter(doc => canRead({ user: currentUser, document: doc, collection, context, operationName }));
          } else if (Array.isArray(canRead)) {
            if (canRead.includes('owners')) {
              // if canReady array includes the owners group, test each document
              // to see if it's owned by the current user
              viewableDocs = docs.filter(doc => Users.isMemberOf(currentUser, canRead, doc));
            } else {
              // else, we don't need a per-document check and just allow or disallow
              // access to all documents at once
              viewableDocs = Users.isMemberOf(currentUser, canRead) ? docs : [];
            }
          }
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

      async resolver(root, { input = {}, _id }, context, { cacheControl }) {
        const { selector: oldSelector = {}, enableCache = false, allowNull = false } = input;
        const operationName = `${typeName}.read.single`;
        //const { _id } = input; // _id is passed from the root
        let doc;

        debug('');
        debugGroup(`--------------- start \x1b[35m${typeName} Single Resolver\x1b[0m ---------------`);
        debug(`Options: ${JSON.stringify(resolverOptions)}`);
        debug(`Selector: ${JSON.stringify(oldSelector)}`);

        if (cacheControl && enableCache) {
          const maxAge = resolverOptions.cacheMaxAge || defaultOptions.cacheMaxAge;
          cacheControl.setCacheHint({ maxAge });
        }

        const { currentUser, Users } = context;
        const collection = context[collectionName];

        // use Dataloader if doc is selected by _id
        if (_id) {
          doc = await collection.loader.load(_id);
        } else {
          let { selector, options, filteredFields } = await Connectors.filter(collection, input, context);
          // make sure all filtered fields are actually readable, for basic roles
          Users.checkFields(currentUser, collection, filteredFields);
          doc = await Connectors.get(collection, selector, options);

          // check again that the fields used for filtering were all valid, this time based on retrieved document
          // this second check is necessary for document based permissions like canRead:["owners", customFunctionThatNeedDoc]
          if (filteredFields.length) {
            doc = Users.canFilterDocument(currentUser, collection, filteredFields, doc) ? doc : null;
          }
        }

        if (!doc) {
          if (allowNull) {
            return { result: null };
          } else {
            throwError({
              id: 'app.missing_document',
              data: { documentId: _id, input, collectionName },
            });
          }
        }

        // new API (Oct 2019)
        let canReadFunction;
        const canRead = get(collection, 'options.permissions.canRead');
        if (canRead) {
          if (typeof canRead === 'function') {
            // if canRead is a function, use it to check current document
            canReadFunction = canRead;
          } else if (Array.isArray(canRead)) {
            // else if it's an array of groups, check if current user belongs to them
            // for the current document
            canReadFunction = ({ user, document }) => Users.isMemberOf(user, canRead, document);
          }
        } else {
          // default to allowing access to all documents
          canReadFunction = () => true;
        }

        if (!canReadFunction({ user: currentUser, document, collection, context, operationName })) {
          throwError({
            id: 'app.operation_not_allowed',
            data: { documentId: document._id, operationName },
          });
        }

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
