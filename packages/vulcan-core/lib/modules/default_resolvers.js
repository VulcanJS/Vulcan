// /*

// Default list, single, and total resolvers

// */

// import {
//   Utils,
//   debug,
//   debugGroup,
//   debugGroupEnd,
//   Connectors,
//   getTypeName,
//   getCollectionName,
//   throwError,
// } from 'meteor/vulcan:lib';
// import isEmpty from 'lodash/isEmpty';
// import get from 'lodash/get';

// const defaultOptions = {
//   cacheMaxAge: 300,
// };

// // note: for some reason changing resolverOptions to "options" throws error
// export function getDefaultResolvers(options) {
//   let typeName, collectionName, resolverOptions;
//   if (typeof arguments[0] === 'object') {
//     // new single-argument API
//     typeName = arguments[0].typeName;
//     collectionName = arguments[0].collectionName || getCollectionName(typeName);
//     resolverOptions = { ...defaultOptions, ...arguments[0].options };
//   } else {
//     // OpenCRUD backwards compatibility
//     collectionName = arguments[0];
//     typeName = getTypeName(collectionName);
//     resolverOptions = { ...defaultOptions, ...arguments[1] };
//   }

//   return {
//     // resolver for returning a list of documents based on a set of query terms

//     multi: {
//       description: `A list of ${typeName} documents matching a set of query terms`,

//       async resolver(root, { input = {} }, context, { cacheControl }) {
//         const { terms = {}, enableCache = false, enableTotal = true } = input;

//         debug('');
//         debugGroup(
//           `--------------- start \x1b[35m${typeName} Multi Resolver\x1b[0m ---------------`
//         );
//         debug(`Options: ${JSON.stringify(resolverOptions)}`);
//         debug(`Terms: ${JSON.stringify(terms)}`);

//         if (cacheControl && enableCache) {
//           const maxAge = resolverOptions.cacheMaxAge || defaultOptions.cacheMaxAge;
//           cacheControl.setCacheHint({ maxAge });
//         }

//         // get currentUser and Users collection from context
//         const { currentUser, Users } = context;

//         // get collection based on collectionName argument
//         const collection = context[collectionName];

//         // get selector and options from terms and perform Mongo query

//         let { selector, options, filteredFields } = isEmpty(terms)
//           ? Connectors.filter(collection, input, context)
//           : await collection.getParameters(terms, {}, context);

//         // make sure all filtered fields are allowed
//         Users.checkFields(currentUser, collection, filteredFields);

//         options.skip = terms.offset;

//         debug({ selector, options });

//         const docs = await Connectors.find(collection, selector, options);

//         let viewableDocs;

//         // new API (Oct 2019)
//         const canRead = get(collection, 'options.permissions.canRead');
//         if (canRead) {
//           if (typeof canRead === 'function') {
//             // if canRead is a function, use it to filter list of documents
//             viewableDocs = docs.filter(doc => canRead(currentUser, doc));
//           } else if (Array.isArray(canRead)) {
//             if (canRead.includes('owners')) {
//               // if canReady array includes the owners group, test each document
//               // to see if it's owned by the current user
//               viewableDocs = docs.filter(doc => Users.isMemberOf(currentUser, canRead, doc));
//             } else {
//               // else, we don't need a per-document check and just allow or disallow
//               // access to all documents at once
//               viewableDocs = Users.isMemberOf(currentUser, canRead) ? viewableDocs : [];
//             }
//           }
//         } else if (collection.checkAccess) {
//           // old API
//           // if collection has a checkAccess function defined, remove any documents that doesn't pass the check
//           viewableDocs = docs.filter(doc => collection.checkAccess(currentUser, doc));
//         } else {
//           // default to allowing access to all documents
//           viewableDocs = docs;
//         }

//         // take the remaining documents and remove any fields that shouldn't be accessible
//         const restrictedDocs = Users.restrictViewableFields(currentUser, collection, viewableDocs);

//         // prime the cache
//         restrictedDocs.forEach(doc => collection.loader.prime(doc._id, doc));

//         debug(`\x1b[33m=> ${restrictedDocs.length} documents returned\x1b[0m`);
//         debugGroupEnd();
//         debug(`--------------- end \x1b[35m${typeName} Multi Resolver\x1b[0m ---------------`);
//         debug('');

//         const data = { results: restrictedDocs };

//         if (enableTotal) {
//           // get total count of documents matching the selector
//           data.totalCount = await Connectors.count(collection, selector);
//         } else {
//           data.totalCount = null;
//         }

//         // return results
//         return data;
//       },
//     },

//     // resolver for returning a single document queried based on id or slug

//     single: {
//       description: `A single ${typeName} document fetched by ID or slug`,

//       async resolver(root, { input = {} }, context, { cacheControl }) {
//         const { selector: oldSelector = {}, enableCache = false, allowNull = false } = input;

//         let doc;

//         debug('');
//         debugGroup(
//           `--------------- start \x1b[35m${typeName} Single Resolver\x1b[0m ---------------`
//         );
//         debug(`Options: ${JSON.stringify(resolverOptions)}`);
//         debug(`Selector: ${JSON.stringify(oldSelector)}`);

//         if (cacheControl && enableCache) {
//           const maxAge = resolverOptions.cacheMaxAge || defaultOptions.cacheMaxAge;
//           cacheControl.setCacheHint({ maxAge });
//         }

//         const { currentUser, Users } = context;
//         const collection = context[collectionName];

//         // use Dataloader if doc is selected by documentId/_id
//         const documentId = oldSelector.documentId || oldSelector._id;
//         const slug = oldSelector.slug;

//         if (documentId) {
//           doc = await collection.loader.load(documentId);
//         } else if (slug) {
//           // make an exception for slug
//           doc = await Connectors.get(collection, { slug });
//         } else {
//           let { selector, filteredFields } = Connectors.filter(collection, input, context);

//           // make sure all filtered fields are allowed
//           Users.checkFields(currentUser, collection, filteredFields);

//           doc = await Connectors.get(collection, selector);
//         }

//         if (!doc) {
//           if (allowNull) {
//             return { result: null };
//           } else {
//             throwError({
//               id: 'app.missing_document',
//               data: { documentId, oldSelector },
//             });
//           }
//         }

//         // if collection has a checkAccess function defined, use it to perform a check on the current document
//         // (will throw an error if check doesn't pass)
//         let canReadFunction;

//         // new API (Oct 2019)
//         const canRead = get(collection, 'options.permissions.canRead');
//         if (canRead) {
//           if (typeof canRead === 'function') {
//             // if canRead is a function, use it to check current document
//             canReadFunction = canRead;
//           } else if (Array.isArray(canRead)) {
//             // else if it's an array of groups, check if current user belongs to them
//             // for the current document
//             canReadFunction = (currentUser, doc) => Users.isMemberOf(currentUser, canRead, doc);
//           }
//         } else if (collection.checkAccess) {
//           // old API
//           canReadFunction = collection.checkAccess;
//         } else {
//           // default to allowing access to all documents
//           canReadFunction = () => true;
//         }

//         Utils.performCheck(
//           canReadFunction,
//           currentUser,
//           doc,
//           collection,
//           documentId,
//           `${typeName}.read.single`,
//           collectionName
//         );

//         const restrictedDoc = Users.restrictViewableFields(currentUser, collection, doc);

//         debugGroupEnd();
//         debug(`--------------- end \x1b[35m${typeName} Single Resolver\x1b[0m ---------------`);
//         debug('');

//         // filter out disallowed properties and return resulting document
//         return { result: restrictedDoc };
//       },
//     },
//   };
// }
