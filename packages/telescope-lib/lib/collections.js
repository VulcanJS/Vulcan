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
 * Global schemas object
 * @namespace Telescope.schemas
 */
Telescope.schemas = {};