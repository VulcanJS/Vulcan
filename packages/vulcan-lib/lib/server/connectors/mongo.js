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
  get: async (collection, selector = {}, options = {}, skipConversion) => {
    const convertedSelector = skipConversion ? selector : convertUniqueSelector(selector)
    return await collection.findOne(convertedSelector, options);
  },
  find: async (collection, selector = {}, options = {}, skipConversion) => {
    const convertedSelector = skipConversion ? selector : convertUniqueSelector(selector)
    return await collection.find(convertedSelector, options).fetch();
  },
  count: async (collection, selector = {}, options = {}, skipConversion) => {
    const convertedSelector = skipConversion ? selector : convertUniqueSelector(selector)
    return await collection.find(convertedSelector, options).count();
  },
  create: async (collection, document, options = {}) => {
    return await collection.insert(document);
  },
  update: async (collection, selector, modifier, options = {}, skipConversion) => {
    const convertedSelector = skipConversion ? selector : convertUniqueSelector(selector)
    return await collection.update(convertedSelector, modifier, options);
  },
  delete: async (collection, selector, options = {}, skipConversion) => {
    const convertedSelector = skipConversion ? selector : convertUniqueSelector(selector)
    return await collection.remove(convertedSelector);
  },
};
