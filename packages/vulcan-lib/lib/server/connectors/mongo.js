import { DatabaseConnectors } from '../connectors.js';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';

import { convertSelector, convertUniqueSelector, filterFunction } from '../../modules/mongoParams';
import { runCallbacks } from '../../modules/index.js';

/*

Connectors

*/
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
  filter: async (collection, input, context) => {
    /*

    When a collection is created, a defaultInput option can be passed
    in order to specify default `filter`, `limit`, `sort`, etc. 
    values that should always apply. 

    */
    const defaultInputObject = await filterFunction(collection, collection.options.defaultInput, context);
    const currentInputObject = await filterFunction(collection, input, context);
    if (defaultInputObject.options.sort && currentInputObject.options.sort) {
      // for sort only, delete default sort instead of merging to avoid issue with
      // default sort coming first in list of sort specifiers
      delete defaultInputObject.options.sort;
    }
    const mergedInputObject = {
      selector: isEmpty(currentInputObject.selector) ? defaultInputObject.selector : currentInputObject.selector,
      options: isEmpty(currentInputObject.options) ? defaultInputObject.options : currentInputObject.options,
      filteredFields: currentInputObject.filteredFields || [],
    };

    const { typeName } = collection.options;
    const finalInputObject = await runCallbacks({
      name: `${typeName.toLowerCase()}.connector.filter`,
      iterator: mergedInputObject,
      properties: { collection, context },
    });
    return finalInputObject;
  },
};
