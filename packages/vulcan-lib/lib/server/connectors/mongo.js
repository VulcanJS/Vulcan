import { DatabaseConnectors } from '../connectors.js';
import mapValues from 'lodash/mapValues';
import { getSetting } from '../../modules/settings.js';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import escapeStringRegexp from 'escape-string-regexp';
import merge from 'lodash/merge';

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

// get all fields mentioned in an expression like [ { foo: { _gt: 2 } }, { bar: { _eq : 3 } } ]
const getFieldNames = expressionArray => {
  return expressionArray.map(exp => {
    const [fieldName] = Object.keys(exp);
    return fieldName;
  });
};

const filterFunction = (collection, input, context) => {
  const { where, limit = 20, orderBy, search, filter, offset } = input;
  let selector = {};
  let options = {
    sort: {},
  };
  let filteredFields = [];

  const schema = collection.simpleSchema()._schema;

  /*

  Convert GraphQL expression into MongoDB expression, for example

  { fieldName: { operator: value } }

  { title: { _in: ["foo", "bar"] } }

  to:

  { title: { $in: ["foo", "bar"] } }

  or (intl fields):

  { title_intl.value: { $in: ["foo", "bar"] } }

  */
  const convertExpression = fieldExpression => {
    const [fieldName] = Object.keys(fieldExpression);
    const [operator] = Object.keys(fieldExpression[fieldName]);
    const value = fieldExpression[fieldName][operator];
    if (isEmpty(value)) {
      throw new Error(`Detected empty filter value for field ${fieldName} with operator ${operator}`);
    }
    const mongoOperator = conversionTable[operator];
    const isIntl = schema[fieldName].intl;
    const mongoFieldName = isIntl ? `${fieldName}_intl.value` : fieldName;
    return { [mongoFieldName]: { [mongoOperator]: value } };
  };

  /*

  When a collection is created, a defaultInput option can be passed
  in order to specify defaut `where`, `limit`, `orderBy`, etc. 
  values that should always apply. 

  */
  if (collection.defaultInput) {
    selector = merge(selector, collection.defaultInput.selector);
    options = merge(options, collection.defaultInput.options);
  }

  /*

  The `view` argument accepts the name of a view function that will then 
  be called to calculate more complex selector and options objects

  */
  if (!isEmpty(filter) && collection.filters && collection.filters[filter]) {
    const filterObject = collection.filters[filter](input, context);
    selector = merge(selector, filterObject.selector);
    options = merge(options, filterObject.options);
  }

  // where
  if (!isEmpty(where)) {
    Object.keys(where).forEach(fieldName => {
      switch (fieldName) {
        case '_and':
          filteredFields = filteredFields.concat(getFieldNames(where._and));
          selector['$and'] = where._and.map(convertExpression);
          break;

        case '_or':
          filteredFields = filteredFields.concat(getFieldNames(where._or));
          selector['$or'] = where._or.map(convertExpression);

          break;

        case '_not':
          filteredFields = filteredFields.concat(getFieldNames(where._not));
          selector['$not'] = where._not.map(convertExpression);
          break;

        case 'search':
          break;

        default:
          filteredFields.push(fieldName);
          selector = { ...selector, ...convertExpression({ [fieldName]: where[fieldName] }) };

          break;
      }
    });
  }

  // orderBy
  if (!isEmpty(orderBy)) {
    options.sort = merge(options.sort, mapValues(orderBy, order => conversionTable[order]));
  }

  // search
  if (!isEmpty(search)) {
    const searchQuery = escapeStringRegexp(search);
    const searchableFieldNames = Object.keys(schema).filter(
      // do not include intl fields here
      fieldName => !fieldName.includes('_intl') && schema[fieldName].searchable
    );
    if (searchableFieldNames.length) {
      selector = {
        ...selector,
        $or: searchableFieldNames.map(fieldName => {
          const isIntl = schema[fieldName].intl;
          return {
            [isIntl ? `${fieldName}_intl.value` : fieldName]: { $regex: searchQuery, $options: 'i' },
          };
        }),
      };
    } else {
      // eslint-disable-next-line no-console
      console.warn(
        `Warning: search argument is set but schema ${
          collection.options.collectionName
        } has no searchable field. Set "searchable: true" for at least one field to enable search.`
      );
    }
  }

  // limit
  if (limit) {
    options.limit = Math.min(limit, getSetting('maxDocumentsPerRequest', 1000));
  }

  // offest
  if (offset) {
    options.skip = offset;
  }

  // console.log(JSON.stringify(input, 2));
  // console.log(JSON.stringify(collection.defaultInput, 2));
  // console.log(JSON.stringify(view, 2));
  // console.log(JSON.stringify(where, 2));
  // console.log(JSON.stringify(selector, 2));
  // console.log(JSON.stringify(options, 2));
  // console.log(uniq(filteredFields));

  return {
    selector,
    options,
    filteredFields: uniq(filteredFields),
  };
};

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
