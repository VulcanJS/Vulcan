// add support for nested properties
const deepValue = function(obj, path){
  for (var i=0, path=path.split('.'), len=path.length; i<len; i++){
    obj = obj[path[i]];
  };
  return obj;
};

// see http://stackoverflow.com/questions/19098797/fastest-way-to-flatten-un-flatten-nested-json-objects
const flatten = function(data) {
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
const getInsertableFields = function (schema, user) {
  const fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return field.insertableIf && field.insertableIf(user);
  });
  return fields;
};

/**
 * @method Mongo.Collection.getEditableFields
 * Get an array of all fields editable by a specific user for a given collection
 * @param {Object} user – the user for which to check field permissions
 */
const getEditableFields = function (schema, user, document) {
  const fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return field.editableIf && field.editableIf(user, document);
  });
  return fields;
};

export { flatten, deepValue, getInsertableFields, getEditableFields };