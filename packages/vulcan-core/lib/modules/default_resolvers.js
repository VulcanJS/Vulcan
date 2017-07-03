/*

Default list, single, and total resolvers

*/

export const getDefaultResolvers = collectionName => ({

  // resolver for returning a list of documents based on a set of query terms

  list: {

    name: `${collectionName}List`,

    resolver(root, {terms}, context, info) {

      // get currentUser and Users collection from context
      const { currentUser, Users } = context;

      // get collection based on collectionName argument
      const collection = context[collectionName];

      // get selector and options from terms and perform Mongo query
      let {selector, options} = collection.getParameters(terms);
      options.skip = terms.offset;
      const docs = collection.find(selector, options).fetch();

      // if collection has a checkAccess function defined, remove any documents that doesn't pass the check
      const viewableDocs = collection.checkAccess ? _.filter(docs, doc => collection.checkAccess(currentUser, doc)) : docs;
      
      // take the remaining documents and remove any fields that shouldn't be accessible
      const restrictedDocs = Users.restrictViewableFields(currentUser, collection, viewableDocs);

      // prime the cache
      restrictedDocs.forEach(doc => collection.loader.prime(doc._id, doc));

      // return results
      return restrictedDocs;
    },

  },

  // resolver for returning a single document queried based on id or slug

  single: {
    
    name: `${collectionName}Single`,

    async resolver(root, {documentId, slug}, context) {

      const { currentUser, Users } = context;
      const collection = context[collectionName];

      // don't use Dataloader if doc is selected by slug
      const doc = documentId ? await collection.loader.load(documentId) : collection.findOne({slug});

      // if collection has a checkAccess function defined, use it to perform a check on the current document
      // (will throw an error if check doesn't pass)
      if (collection.checkAccess) {
        Utils.performCheck(collection.checkAccess, currentUser, doc, collection, documentId);
      }

      // filter out disallowed properties and return resulting document
      return Users.restrictViewableFields(currentUser, collection, doc);
    },
  
  },

  // resolver for returning the total number of documents matching a set of query terms

  total: {
    
    name: `${collectionName}Total`,
    
    resolver(root, {terms}, context) {
      
      const collection = context[collectionName];

      const {selector} = collection.getParameters(terms);
      return collection.find(selector).count();
    },
  
  }
});
