import Users from 'meteor/vulcan:users';
import merge from 'lodash/merge';
import find from 'lodash/find';
import isObjectLike from 'lodash/isObjectLike';
import set from 'lodash/set';

import { removePrefix, filterPathsByPrefix } from './path_utils';

// add support for nested properties
export const deepValue = function(obj, path){
  const pathArray = path.split('.');

  for (var i=0; i < pathArray.length; i++) {
    obj = obj[pathArray[i]];
  }

  return obj;
};

// see http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
export const flatten = function(data) {
  var result = {};
  function recurse (cur, prop) {

    if (Object.prototype.toString.call(cur) !== "[object Object]") {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for(var i=0, l=cur.length; i<l; i++)
        recurse(cur[i], prop + "[" + i + "]");
      if (l == 0)
        result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop+"."+p : p);
      }
      if (isEmpty && prop)
        result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}

/**
 * @method Mongo.Collection.getInsertableFields
 * Get an array of all fields editable by a specific user for a given collection
 * @param {Object} user – the user for which to check field permissions
 */
export const getInsertableFields = function (schema, user) {
  const fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return Users.canCreateField(user, field);
  });
  return fields;
};

/**
 * @method Mongo.Collection.getEditableFields
 * Get an array of all fields editable by a specific user for a given collection (and optionally document)
 * @param {Object} user – the user for which to check field permissions
 */
export const getEditableFields = function (schema, user, document) {
  const fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return Users.canUpdateField(user, field, document);
  });
  return fields;
};

export const isEmptyValue = value => (typeof value === 'undefined' || value === '' || Array.isArray(value) && value.length === 0);

export const mergeValue = ({
  locale,
  currentValue,
  documentValue,
  emptyValue,
  datatype,
}) => {
  if (locale) {
    // note: intl fields are of type Object but should be treated as Strings
    return currentValue || documentValue || emptyValue;
  } else if (Array.isArray(currentValue) && find(datatype, ['type', Array])) {
    // for object and arrays, use lodash's merge
    // if field type is array, use [] as merge seed to force result to be an array as well
    return merge([], documentValue, currentValue);
  } else if (isObjectLike(currentValue) && find(datatype, ['type', Object])) {
    return merge({}, documentValue, currentValue);
  }
  return undefined;
};

/**
 * Converts a list of field names to an object of deleted values.
 *
 * @param {string[]|Object.<string|string>} deletedFields
 *  List of deleted field names or paths
 * @param {Object|Array=} accumulator={}
 *  Value to reduce the values to
 * @return {Object|Array}
 *  Deleted values, with the structure defined by taking the received deleted
 *  fields as paths
 * @example
 *  const deletedFields = [
 *    'field.subField',
 *    'field.subFieldArray[0]',
 *    'fieldArray[0]',
 *    'fieldArray[2].name',
 *  ];
 *  getNestedDeletedValues(deletedFields);
 *  // => { 'field': { 'subField': null, 'subFieldArray': [null] }, 'fieldArray': [null, undefined, { name: null } }
 */
export const getDeletedValues = (deletedFields, accumulator = {}) =>
  deletedFields.reduce(
    (deletedValues, path) => set(deletedValues, path, null),
    accumulator,
  );

/**
 * Filters the given field names by prefix, removes it from each one of them
 * and convert the list to an object of deleted values.
 *
 * @param {string=} prefix
 *  Prefix to filter and remove from deleted fields
 * @param {string[]|Object.<string|string>} deletedFields
 *  List of deleted field names or paths
 * @param {Object|Array=} accumulator={}
 *  Value to reduce the values to
 * @return {Object.<string, null>}
 *  Object keyed with the given deleted fields, valued with `null`
 * @example
 *  const deletedFields = [
 *    'field.subField',
 *    'field.subFieldArray[0]',
 *    'fieldArray[0]',
 *    'fieldArray[2].name',
 *  ];
 *  getNestedDeletedValues('field', deletedFields);
 *  // => { 'subField': null, 'subFieldArray': [null] }
 *  getNestedDeletedValues('fieldArray', deletedFields);
 *  // => { '0': null, '2': { 'name': null } }
 *  getNestedDeletedValues('fieldArray', deletedFields, []);
 *  // => [null, undefined, { 'name': null } ]
 */
export const getNestedDeletedValues = (prefix, deletedFields, accumulator = {}) =>
  getDeletedValues(
    removePrefix(prefix, filterPathsByPrefix(prefix, deletedFields)),
    accumulator,
  );
