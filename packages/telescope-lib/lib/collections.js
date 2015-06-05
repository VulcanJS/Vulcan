/**
 * Meteor Collections.
 * @class Mongo.Collection
 */

/**
 * Add an additional field (or an array of fields) to a schema.
 * @param {Object|Object[]} field
 */
Mongo.Collection.prototype.addField = function (fieldOrFieldArray) {

  var collection = this;
  var fieldSchema = {};

  var fieldArray = Array.isArray(fieldOrFieldArray) ? fieldOrFieldArray : [fieldOrFieldArray];

  // loop over fields and add them to schema
  fieldArray.forEach(function (field) {
    fieldSchema[field.fieldName] = field.fieldSchema;
  });

  // add field schema to collection schema
  collection.attachSchema(fieldSchema);
};

/**
 * Remove a field from a schema.
 * @param {String} fieldName
 */
Mongo.Collection.prototype.removeField = function (fieldName) {

  var collection = this;
  var schema = _.omit(collection.simpleSchema()._schema, fieldName);

  // add field schema to collection schema
  collection.attachSchema(schema, {replace: true});
};

/**
 * Check if an operation is allowed
 * @param {Object} collection – the collection to which the document belongs
 * @param {string} userId – the userId of the user performing the operation
 * @param {Object} document – the document being modified
 * @param {string[]} fieldNames – the names of the fields being modified
 * @param {Object} modifier – the modifier
 */
Telescope.allowCheck = function (collection, userId, document, fieldNames, modifier) {

  var schema = collection.simpleSchema();
  var user = Meteor.users.findOne(userId);
  var allowedFields = schema.getEditableFields(user);
  var fields = [];

  // fieldNames only contains top-level fields, so loop over modifier to get real list of fields
  _.each(modifier, function (operation) {
    fields = fields.concat(_.keys(operation));
  });

  // allow update only if:
  // 1. user has rights to edit the document
  // 2. there is no fields in fieldNames that are not also in allowedFields
  return Users.can.edit(userId, document) && _.difference(fields, allowedFields).length == 0;

};

// Note: using the prototype doesn't work in allow/deny for some reason
Meteor.Collection.prototype.allowCheck = function (userId, document, fieldNames, modifier) {
  Telescope.allowCheck(this, userId, document, fieldNames, modifier);
};

/**
 * Global schemas object. Note: not reactive, won't be updated after initialization
 * @namespace Telescope.schemas
 */
Telescope.schemas = {};

/**
 * @method SimpleSchema.getEditableFields
 * Get a list of all fields editable by a specific user for a given schema
 * @param {Object} user – the user for which to check field permissions
 */
SimpleSchema.prototype.getEditableFields = function (user) {
  var schema = this._schema;
  var fields = _.sortBy(_.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return Users.can.editField(user, field);
  }), function (fieldName) {
    var field = schema[fieldName];
    return field.autoform && field.autoform.order;
  });
  return fields;
};

SimpleSchema.prototype.getPublicFields = function () {
  var schema = this._schema;
  var fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return !!field.public;
  });
  return fields;
};

SimpleSchema.prototype.getProfileFields = function () {
  var schema = this._schema;
  var fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return !!field.profile;
  });
  return fields;
};