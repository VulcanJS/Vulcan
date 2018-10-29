import Users from 'meteor/vulcan:users';
/**
 * @method Mongo.Collection.getInsertableFields
 * Get an array of all fields editable by a specific user for a given collection
 * @param {Object} user – the user for which to check field permissions
 */
export const getInsertableFields = function(schema, user) {
  const fields = _.filter(_.keys(schema), function(fieldName) {
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
