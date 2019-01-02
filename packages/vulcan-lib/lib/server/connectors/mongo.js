import { DatabaseConnectors } from '../connectors.js';

// convert GraphQL selector into Mongo-compatible selector
// TODO: add support for more than just documentId/_id and slug, potentially making conversion unnecessary
// see https://github.com/VulcanJS/Vulcan/issues/2000
const convertSelector = selector => {
  return selector;
};
const convertUniqueSelector = selector => {
  if (selector.documentId) {
    selector._id = selector.documentId;
    delete selector.documentId;
  }
  return selector;
};

DatabaseConnectors.mongo = {
  get: async (collection, selector = {}, options = {}) => {
    return await collection.findOne(convertUniqueSelector(selector), options);
  },
  find: async (collection, selector = {}, options = {}) => {
    return await collection.find(convertSelector(selector), options).fetch();
  },
  count: async (collection, selector = {}, options = {}) => {
    return await collection.find(convertSelector(selector), options).count();
  },
  create: async (collection, document, options = {}) => {
    return await collection.insert(document);
  },
  update: async (collection, selector, modifier, options = {}) => {
    return await collection.update(convertUniqueSelector(selector), modifier, options);
  },
  delete: async (collection, selector, options = {}) => {
    return await collection.remove(convertUniqueSelector(selector));
  },
};