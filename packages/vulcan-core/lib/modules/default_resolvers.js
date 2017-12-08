/*

Default list, single, and total resolvers

*/

import { Utils, debug } from 'meteor/vulcan:core';

const defaultOptions = {
  enableCache: false,
  cacheMaxAge: 300
}

export const getDefaultResolvers = (collectionName, resolverOptions = defaultOptions) => {

  return {

    // resolver for returning a list of documents based on a set of query terms

    list: {

      name: `${collectionName}List`,

      async resolver(root, {terms = {}}, context, { cacheControl }) {

        debug(`//--------------- start ${collectionName} list resolver ---------------//`);
        debug(terms);

        if (cacheControl && resolverOptions.enableCache) {
          cacheControl.setCacheHint({ maxAge: resolverOptions.cacheMaxAge });
        }

        // get currentUser and Users collection from context
        const { currentUser, Users } = context;

        // get collection based on collectionName argument
        const collection = context[collectionName];

        // get selector and options from terms and perform Mongo query
        let {selector, options} = await collection.getParameters(terms, {}, context);
        options.skip = terms.offset;

        debug({ selector, options });

        const docs = collection.find(selector, options).fetch();

        // if collection has a checkAccess function defined, remove any documents that doesn't pass the check
        const viewableDocs = collection.checkAccess ? _.filter(docs, doc => collection.checkAccess(currentUser, doc)) : docs;
        
        // take the remaining documents and remove any fields that shouldn't be accessible
        const restrictedDocs = Users.restrictViewableFields(currentUser, collection, viewableDocs);

        // prime the cache
        restrictedDocs.forEach(doc => collection.loader.prime(doc._id, doc));

        debug(`// ${restrictedDocs.length} documents returned`);
        debug(`//--------------- end ${collectionName} list resolver ---------------//`);

        // return results
        return restrictedDocs;
      },

    },

    // resolver for returning a single document queried based on id or slug

    single: {
      
      name: `${collectionName}Single`,

      async resolver(root, {documentId, slug}, context, { cacheControl }) {

        debug(`//--------------- start ${collectionName} single resolver ---------------//`);
        debug(documentId);

        if (cacheControl && resolverOptions.enableCache) {
          cacheControl.setCacheHint({ maxAge: resolverOptions.cacheMaxAge });
        }

        const { currentUser, Users } = context;
        const collection = context[collectionName];

        // don't use Dataloader if doc is selected by slug
        const doc = documentId ? await collection.loader.load(documentId) : (slug ? collection.findOne({slug}) : collection.findOne());

        // if collection has a checkAccess function defined, use it to perform a check on the current document
        // (will throw an error if check doesn't pass)
        if (collection.checkAccess) {
          Utils.performCheck(collection.checkAccess, currentUser, doc, collection, documentId);
        }

        const restrictedDoc = Users.restrictViewableFields(currentUser, collection, doc);

        debug(`//--------------- end ${collectionName} single resolver ---------------//`);

        // filter out disallowed properties and return resulting document
        return restrictedDoc;
      },
    
    },

    // resolver for returning the total number of documents matching a set of query terms

    total: {
      
      name: `${collectionName}Total`,
      
      async resolver(root, {terms}, context, { cacheControl }) {
        
        if (cacheControl && resolverOptions.enableCache) {
          cacheControl.setCacheHint({ maxAge: resolverOptions.cacheMaxAge });
        }

        const collection = context[collectionName];

        const {selector} = await collection.getParameters(terms, {}, context);

        return collection.find(selector).count();
      },
    
    }
  }

};
