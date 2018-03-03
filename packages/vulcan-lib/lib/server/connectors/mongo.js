import { DatabaseConnectors } from '../connectors.js';

DatabaseConnectors.mongo = {
  get: async (collection, selector = {}, options = {}) => {
    return await collection.findOne(selector, options);
  },
  find: async (collection, selector = {}, options = {}) => {
    return await collection.find(selector, options).fetch();
  },
  count: async (collection, selector = {}, options = {}) => {
    return await collection.find(selector, options).count();
  },
  create: async (collection, document, options = {}) => {
    return await collection.insert(document);
  },
  update: async (collection, selector, modifier, options = {}) => {
    return await collection.update(selector, modifier, options);
  },
  delete: async (collection, selector, options = {}) => {
    return await collection.remove(selector);
  },
}