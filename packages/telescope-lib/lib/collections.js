/**
 * Add an additional field to a schema.
 * @param {Object} field
 */
Meteor.Collection.prototype.registerField = function (field) {

  var collection = this;
  var fieldSchema = {};
  
  fieldSchema[field.propertyName] = field.propertySchema;

  // add field schema to collection schema
  collection.attachSchema(fieldSchema);
}

/**
 * Remove a field from a schema.
 * @param {String} fieldName
 */
Meteor.Collection.prototype.removeField = function (fieldName) {

  var collection = this;
  var schema = _.omit(collection.simpleSchema()._schema, fieldName);

  // add field schema to collection schema
  collection.attachSchema(schema, {replace: true});
}

/**
 * Global schemas object
 * @namespace Telescope.schemas
 */
Telescope.schemas = {};