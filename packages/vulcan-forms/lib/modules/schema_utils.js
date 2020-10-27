/*
 * Schema converter/getters
 */
import { Utils } from 'meteor/vulcan:core';
import Users from 'meteor/vulcan:users';
import _keys from 'lodash/keys';
import _filter from 'lodash/filter';

/* getters */
// filter out fields with "." or "$"
export const getValidFields = schema => {
  return Object.keys(schema).filter(fieldName => !fieldName.includes('$') && !fieldName.includes('.'));
};

export const getReadableFields = schema => {
  // OpenCRUD backwards compatibility
  return getValidFields(schema).filter(fieldName => schema[fieldName].canRead || schema[fieldName].viewableBy);
};

/*

Convert a nested SimpleSchema schema into a JSON object
If flatten = true, will create a flat object instead of nested tree

/* permissions */

/**
 * @method Mongo.Collection.getInsertableFields
 * Get an array of all fields editable by a specific user for a given collection
 * @param {Object} user – the user for which to check field permissions
 */
export const getInsertableFields = function(schema, user) {
  const fields = _filter(_keys(schema), function(fieldName) {
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
export const getEditableFields = function(schema, user, document) {
  const fields = _.filter(_.keys(schema), function(fieldName) {
    var field = schema[fieldName];
    return Users.canUpdateField(user, field, document);
  });
  return fields;
};

export const convertSchema = (schema, options = {}) => {
  
  const { flatten = false, removeArrays = true } = options;

  if (schema._schema) {
    let jsonSchema = {};

    Object.keys(schema._schema).forEach(fieldName => {
      // exclude array fields
      if (removeArrays && fieldName.includes('$')) {
        return;
      }

      // extract schema
      jsonSchema[fieldName] = getFieldSchema(fieldName, schema);

      // check for existence of nested field
      // and get its schema if possible or its type otherwise
      const subSchemaOrType = getNestedFieldSchemaOrType(fieldName, schema);
      if (subSchemaOrType) {
        // remember the subschema if it exists, allow to customize labels for each group of items for arrays of objects
        jsonSchema[fieldName].arrayFieldSchema = getFieldSchema(`${fieldName}.$`, schema);

        // call convertSchema recursively on the subSchema
        const convertedSubSchema = convertSchema(subSchemaOrType, options);
        // nested schema can be a field schema ({type, canRead, etc.}) (convertedSchema will be null)
        // or a schema on its own with subfields (convertedSchema will return smth)
        if (!convertedSubSchema) {
          // subSchema is a simple field in this case (eg array of numbers)
          jsonSchema[fieldName].isSimpleArrayField = true; //getFieldSchema(`${fieldName}.$`, schema);
        } else {
          // subSchema is a full schema with multiple fields (eg array of objects)
          if (flatten) {
            jsonSchema = { ...jsonSchema, ...convertedSubSchema };
          } else {
            jsonSchema[fieldName].schema = convertedSubSchema;
          }
        }
      }
    });
    return jsonSchema;
  } else {
    return null;
  }
};

/*

Get a JSON object representing a field's schema

*/
export const getFieldSchema = (fieldName, schema) => {
  let fieldSchema = {};
  schemaProperties.forEach(property => {
    const propertyValue = schema.get(fieldName, property);
    if (propertyValue) {
      fieldSchema[property] = propertyValue;
    }
  });
  return fieldSchema;
};

// type is an array due to the possibility of using SimpleSchema.oneOf
// right now we support only fields with one type
export const getSchemaType = Utils.getFieldType;

const getArrayNestedSchema = (fieldName, schema) => {
  const arrayItemSchema = schema._schema[`${fieldName}.$`];
  const nestedSchema = arrayItemSchema && getSchemaType(arrayItemSchema);
  return nestedSchema;
};
// nested object fields type is of the form "type: new SimpleSchema({...})"
// so they should possess a "_schema" prop
const isNestedSchemaField = fieldSchema => {
  const fieldType = getSchemaType(fieldSchema);
  //console.log('fieldType', typeof fieldType, fieldType._schema)
  return fieldType && !!fieldType._schema;
};
const getObjectNestedSchema = (fieldName, schema) => {
  const fieldSchema = schema._schema[fieldName];
  if (!isNestedSchemaField(fieldSchema)) return null;
  const nestedSchema = fieldSchema && getSchemaType(fieldSchema);
  return nestedSchema;
};
/*

Given an array field, get its nested schema
If the field is not an object, this will return the subfield type instead
*/
export const getNestedFieldSchemaOrType = (fieldName, schema) => {
  const arrayItemSchema = getArrayNestedSchema(fieldName, schema);
  if (!arrayItemSchema) {
    // look for an object schema
    const objectItemSchema = getObjectNestedSchema(fieldName, schema);
    // no schema was found
    if (!objectItemSchema) return null;
    return objectItemSchema;
  }
  return arrayItemSchema;
};

export const schemaProperties = [
  'type',
  'label',
  'optional',
  'required',
  'min',
  'max',
  'exclusiveMin',
  'exclusiveMax',
  'minCount',
  'maxCount',
  'allowedValues',
  'regEx',
  'blackbox',
  'trim',
  'custom',
  'defaultValue',
  'autoValue',
  'hidden', // hidden: true means the field is never shown in a form no matter what
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'form', // form placeholder
  'inputProperties', // form placeholder
  'itemProperties',
  'control', // SmartForm control (String or React component)
  'input', // SmartForm control (String or React component)
  'autoform', // legacy form placeholder; backward compatibility (not used anymore)
  'order', // position in the form
  'group', // form fieldset group
  'onCreate', // field insert callback
  'onUpdate', // field edit callback
  'onDelete', // field remove callback
  'onInsert', // OpenCRUD backwards compatibility
  'onEdit', // OpenCRUD backwards compatibility
  'onRemove', // OpenCRUD backwards compatibility
  'canRead',
  'canCreate',
  'canUpdate',
  'viewableBy', // OpenCRUD backwards compatibility
  'insertableBy', // OpenCRUD backwards compatibility
  'editableBy', // OpenCRUD backwards compatibility
  'resolveAs',
  'searchable',
  'description',
  'beforeComponent',
  'afterComponent',
  'placeholder',
  'options',
  'query',
  'queryWaitsForValue',
  'autocompleteQuery',
  'fieldProperties',
  'intl',
  'intlId',
];

export const formProperties = [
  'optional',
  'required',
  'min',
  'max',
  'exclusiveMin',
  'exclusiveMax',
  'minCount',
  'maxCount',
  'allowedValues',
  'regEx',
  'blackbox',
  'trim',
  'custom',
  'defaultValue',
  'autoValue',
  'mustComplete', // mustComplete: true means the field is required to have a complete profile
  'form', // form placeholder
  'inputProperties', // form placeholder
  'itemProperties',
  'control', // SmartForm control (String or React component)
  'input', // SmartForm control (String or React component)
  'order', // position in the form
  'group', // form fieldset group
  'description',
  'beforeComponent',
  'afterComponent',
  'placeholder',
  'options',
  'query',
  'queryWaitsForValue',
  'autocompleteQuery',
  'fieldProperties',
];
