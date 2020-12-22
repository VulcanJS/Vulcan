/**
 * Converts selector and options to Mongo parameters (selector, fields)
 */
import mapValues from 'lodash/mapValues';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
import escapeStringRegexp from 'escape-string-regexp';
import merge from 'lodash/merge';
import { Utils } from './utils';

import { getSetting } from './settings.js';
// convert GraphQL selector into Mongo-compatible selector
// TODO: add support for more than just documentId/_id and slug, potentially making conversion unnecessary
// see https://github.com/VulcanJS/Vulcan/issues/2000
export const convertSelector = selector => {
  return selector;
};
export const convertUniqueSelector = selector => {
  if (selector.documentId) {
    selector._id = selector.documentId;
    delete selector.documentId;
  }
  return selector;
};

// see https://stackoverflow.com/a/3561711
export const escapeRegex = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

/*

Filtering

Note: we use $elemMatch syntax for consistency so that we can be sure that every mongo operator function
returns an object.

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
  _is_null: value => ({ $exists: !value }),
  _is: value => ({ $elemMatch: { $eq: value } }),
  _contains: value => ({ $elemMatch: { $eq: value } }),
  _contains_all: '$all',
  asc: 1,
  desc: -1,
  _like: value => ({
    $regex: escapeRegex(value),
    $options: 'i',
  }),
};

// get all fields mentioned in an expression like [ { foo: { _gt: 2 } }, { bar: { _eq : 3 } } ]
const getFieldNames = expressionArray => {
  return expressionArray.map(exp => {
    const [fieldName] = Object.keys(exp);
    return fieldName;
  });
};

export const filterFunction = async (collection, input = {}, context) => {
  // eslint-disable-next-line no-unused-vars
  const { filter, limit, sort, search, filterArguments, offset, id } = input;
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
    const operators = Object.keys(fieldExpression[fieldName]);
    const mongoExpression = {};
    operators.forEach(operator => {
      const value = fieldExpression[fieldName][operator];
      if (Utils.isEmptyOrUndefined(value)) {
        throw new Error(`Detected empty filter value for field “${fieldName}” with operator “${operator}”`);
      }
      const mongoOperator = conversionTable[operator];
      if (!mongoOperator) {
        throw new Error(`Operator ${operator} is not valid. Possible operators are: ${Object.keys(conversionTable)}`);
      }
      const mongoObject = typeof mongoOperator === 'function' ? mongoOperator(value) : { [mongoOperator]: value };
      merge(mongoExpression, mongoObject);
    });
    const isIntl = schema[fieldName].intl;
    const mongoFieldName = isIntl ? `${fieldName}_intl.value` : fieldName;
    return { [mongoFieldName]: mongoExpression };
  };

  // id
  if (id) {
    selector = { _id: id };
  }

  // filter
  if (!isEmpty(filter)) {
    Object.keys(filter).forEach(fieldName => {
      switch (fieldName) {
        case '_and':
          filteredFields = filteredFields.concat(getFieldNames(filter._and));
          selector['$and'] = filter._and.map(convertExpression);
          break;

        case '_or':
          filteredFields = filteredFields.concat(getFieldNames(filter._or));
          selector['$or'] = filter._or.map(convertExpression);
          break;

        case '_not':
          filteredFields = filteredFields.concat(getFieldNames(filter._not));
          selector['$not'] = filter._not.map(convertExpression);
          break;

        case 'search':
          break;

        default:
          const customFilters = collection.options.customFilters;
          const customFilter = customFilters && customFilters.find(f => f.name === fieldName);
          if (customFilter) {
            // field is not actually a field, but a custom filter
            const filterArguments = filter[customFilter.name];
            // TODO: make this work with await
            const filterObject = customFilter.filter({
              input,
              context,
              filterArguments,
            });
            selector = merge({}, selector, filterObject.selector);
            options = merge({}, options, filterObject.options);
          } else {
            // regular field
            filteredFields.push(fieldName);
            selector = { ...selector, ...convertExpression({ [fieldName]: filter[fieldName] }) };
          }
          break;
      }
    });
  }

  // sort
  if (!isEmpty(sort)) {
    options.sort = merge(
      {},
      options.sort,
      mapValues(sort, order => {
        const mongoOrder = conversionTable[order];
        if (!order) {
          throw new Error(`Operator ${order} is not valid. Possible operators: asc, desc`);
        }
        return mongoOrder;
      })
    );
  } else {
    options.sort = { createdAt: -1 }; // reliable default order
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
            [isIntl ? `${fieldName}_intl.value` : fieldName]: {
              $regex: searchQuery,
              $options: 'i',
            },
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
  const maxLimit = getSetting('maxDocumentsPerRequest', 1000);
  options.limit = limit ? Math.min(limit, maxLimit) : maxLimit;

  // offest
  if (offset) {
    options.skip = offset;
  }

  // console.log('// collection');
  // console.log(collection.options.collectionName);
  // console.log('// input');
  // console.log(JSON.stringify(input, 2));
  // console.log('// selector');
  // console.log(JSON.stringify(selector, 2));
  // console.log('// options');
  // console.log(JSON.stringify(options, 2));
  // console.log('// filterFields');
  // console.log(uniq(filteredFields));

  return {
    selector,
    options,
    filteredFields: uniq(filteredFields),
  };
};
