import { Collections, Connectors, addGraphQLQuery, addGraphQLResolvers } from 'meteor/vulcan:lib';

const getDatabaseObject = async (root, { id }, context) => {
  let document;
  for (const collection of Collections) {
    try {
      // eslint-disable-next-line no-await-in-loop
      document = await Connectors.get(collection, { _id: id });
      if (document) {
        return { collectionName: collection.options.collectionName, document };
      }
    } catch (error) {
      // do nothing
    }
  }
  return null;
};

addGraphQLQuery(`getDatabaseObject(id: String): JSON`);
addGraphQLResolvers({ Query: { getDatabaseObject } });
