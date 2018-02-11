import { Connectors } from '../connectors.js';

Connectors.mongo = {
  findOne: async (collection, documentId) => {
    return await collection.findOne(documentId);
  },
  find: async (collection, selector, options) => {
    return await collection.find(selector, options).fetch();
  },
  count: async (collection, selector, options) => {
    return await collection.find(selector, options).count();
  },
  new: async (collection, document) => {
    return await collection.insert(document);
  },
  edit: async (collection, documentId, modifier, options) => {
    return await collection.update(documentId, modifier, options);
  },
  remove: async (collection, documentId, options) => {
    return await collection.remove(documentId);
  },
}