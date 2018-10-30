import merge from 'lodash/merge';
import find from 'lodash/find';
import isPlainObject from 'lodash/isPlainObject';
import set from 'lodash/set';
import size from 'lodash/size';

import { removePrefix, filterPathsByPrefix } from './path_utils';

// add support for nested properties
export const deepValue = function(obj, path) {
  const pathArray = path.split('.');

  for (var i = 0; i < pathArray.length; i++) {
    obj = obj[pathArray[i]];
  }

  return obj;
};

// see http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
export const flatten = function(data) {
  var result = {};
  function recurse(cur, prop) {
    if (Object.prototype.toString.call(cur) !== '[object Object]') {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + '[' + i + ']');
      if (l == 0) result[prop] = [];
    } else {
      var isEmpty = true;
      for (var p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + '.' + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, '');
  return result;
};

export const isEmptyValue = value =>
  typeof value === 'undefined' || value === null || value === '' || (Array.isArray(value) && value.length === 0);

/**
 * Merges values. It takes into account the current, original and deleted values,
 * and the merge produces the proper type for simple objects or arrays.
 *
 * @param {Object} props
 *  Form component props. Only specific properties for this function are documented.
 * @param {*} props.currentValue
 *  Current value of the field
 * @param {*} props.documentValue
 *  Original value of the field
 * @return {*|undefined}
 *  Merged value or undefined if no merge was performed
 */
export const mergeValue = ({ currentValue, documentValue, deletedValues: deletedFields, path, locale, datatype }) => {
  if (locale) {
    // note: intl fields are of type Object but should be treated as Strings
    return currentValue || documentValue || '';
  }

  // note: retrieve nested deleted values is performed here to avoid skipping
  // the merge in case the current field is not in `currentValues` but a nested
  // property has been removed directly by path
  const deletedValues = getNestedDeletedValues(path, deletedFields);
  const hasDeletedValues = !!size(deletedValues);
  if ((Array.isArray(currentValue) || hasDeletedValues) && find(datatype, ['type', Array])) {
    return merge([], documentValue, currentValue, deletedValues);
  } else if ((isPlainObject(currentValue) || hasDeletedValues) && find(datatype, ['type', Object])) {
    return merge({}, documentValue, currentValue, deletedValues);
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
  deletedFields.reduce((deletedValues, path) => set(deletedValues, path, null), accumulator);

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
  getDeletedValues(removePrefix(prefix, filterPathsByPrefix(prefix, deletedFields)), accumulator);

export const getFieldType = datatype => datatype[0].type;
/**
 * Get appropriate null value for various field types
 *
 * @param {Array} datatype
 * Field's datatype property
 */
export const getNullValue = datatype => {
  const fieldType = getFieldType(datatype);
  if (fieldType === Array) {
    return [];
  } else if (fieldType === Boolean) {
    return false;
  } else if (fieldType === String) {
    return '';
  } else if (fieldType === Number) {
    return '';
  } else {
    // normalize to null
    return null;
  }
};
