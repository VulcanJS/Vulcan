import { Connectors } from '../connectors.js';

Connectors.mongo = {
  get: async (collection, documentId, options) => {
    return await collection.findOne(documentId);
  },
  find: async (collection, selector, options) => {
    return await collection.find(selector, options).fetch();
  },
  count: async (collection, selector, options) => {
    return await collection.find(selector, options).count();
  },
  create: async (collection, document, options) => {
    return await collection.insert(document);
  },
  update: async (collection, documentId, modifier, options) => {
    return await collection.update(documentId, modifier, options);
  },
  delete: async (collection, documentId, options) => {
    return await collection.remove(documentId);
  },
}