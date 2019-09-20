import { DatabaseConnectors } from '../connectors.js';
import mapValues from 'lodash/mapValues';

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


/*

Filtering

*/
const conversionTable = {
  _eq: '$eq',
  _gt: '$gt',
  _gte: '$gte',
  _in: '$in',
  _lt: '$lt',
  _lte: '$lte',
  _neq: '$ne',
  _nin: '$nin',
  asc: 1,
  desc: -1,
};

/*

Convert GraphQL expression into MongoDB expression, for example

{ _in: ["foo", "bar"] }

to

{ $in: ["foo", "bar"] }

*/
const convertExpression = expression => {
  const graphqlOperator = Object.keys(expression)[0];
  const value = expression[graphqlOperator];
  const mongoOperator = conversionTable[graphqlOperator];
  return { [mongoOperator]: value };
};

const filterFunction = ({ where, limit = 20, orderBy }) => {

  let selector = {};
  let options = {};

  // filter
  Object.keys(where).forEach(fieldName => {
    switch (fieldName) {
      case '_and':
        selector['$and'] = where._and.map(field => mapValues(field, convertExpression));
        break;

      case '_or':
        selector['$or'] = where._or.map(field => mapValues(field, convertExpression));

        break;

      case '_not':
        selector['$not'] = where._not.map(field => mapValues(field, convertExpression));
        break;

      case 'search':
        break;

      default:
        selector[fieldName] = convertExpression(where[fieldName]);

        break;
    }
  });

  // order
  if (orderBy) {
    options.sort = mapValues(orderBy, order => conversionTable[order]);
  }

  // limit
  if (limit) {
    options.limit = limit;
  }

  // console.log(JSON.stringify(selector, 2));
  // console.log(JSON.stringify(options, 2));

  return {
    selector,
    options,
  };
}

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
  filter: filterFunction,
};
