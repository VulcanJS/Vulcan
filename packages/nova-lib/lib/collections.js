import Telescope from './config.js';

SimpleSchema.extendOptions({
  viewableIf: Match.Optional(Match.OneOf(Function, [String])),
  insertableIf: Match.Optional(Match.OneOf(Function, [String])),
  editableIf: Match.Optional(Match.OneOf(Function, [String])),
  resolveAs: Match.Optional(String),
  publish: Match.Optional(Boolean),
});

/**
 * @summary Meteor Collections.
 * @class Mongo.Collection
 */

/**
 * @summary @summary Add an additional field (or an array of fields) to a schema.
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
 * @summary Remove a field from a schema.
 * @param {String} fieldName
 */
Mongo.Collection.prototype.removeField = function (fieldName) {

  var collection = this;
  var schema = _.omit(collection.simpleSchema()._schema, fieldName);

  // add field schema to collection schema
  collection.attachSchema(schema, {replace: true});
};

/**
 * @summary Global schemas object. Note: not reactive, won't be updated after initialization
 * @namespace Telescope.schemas
 */
Telescope.schemas = {};

SimpleSchema.prototype.getProfileFields = function () {
  var schema = this._schema;
  var fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return !!field.profile;
  });
  return fields;
};

/**
 * @summary Get a list of a schema's private fields
 * @namespace Telescope.schemas
 */
Mongo.Collection.prototype.getPrivateFields = function () {
  var schema = this.simpleSchema()._schema;
  var fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return field.publish !== true;
  });
  return fields;
};


/**
 * @summary Get a list of a schema's public fields
 * @namespace Telescope.schemas
 */
Mongo.Collection.prototype.getPublicFields = function () {
  var schema = this.simpleSchema()._schema;
  var fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return field.publish === true;
  });
  return fields;
};

Telescope.createCollection = options => {

  // initialize new Mongo collection
  const collection = options.collectionName === 'users' ? Meteor.users : new Mongo.Collection(options.collectionName);

  // decorate collection with options
  collection.options = options;

  // add typeName
  collection.typeName = options.typeName;

  if (options.schema) {
    // attach schema to collection
    collection.attachSchema(new SimpleSchema(options.schema));
  }

  // add collection to list of dynamically generated GraphQL schemas
  Telescope.graphQL.addCollection(collection);

  // add collection to resolver context
  const context = {};
  context[Telescope.utils.capitalize(options.collectionName)] = collection;
  Telescope.graphQL.addToContext(context);

  // ------------------------------------- Queries -------------------------------- //
  
  if (options.resolvers) {
    const queryResolvers = {};
    // list
    if (options.resolvers.list) { // e.g. ""
      Telescope.graphQL.addQuery(`${options.resolvers.list.name}(terms: Terms, offset: Int, limit: Int): [${options.typeName}]`);
      queryResolvers[options.resolvers.list.name] = options.resolvers.list.resolver;
    }
    // single
    if (options.resolvers.single) {
      Telescope.graphQL.addQuery(`${options.resolvers.single.name}(documentId: String): ${options.typeName}`);
      queryResolvers[options.resolvers.single.name] = options.resolvers.single.resolver;
    }
    // total
    if (options.resolvers.total) {
      Telescope.graphQL.addQuery(`${options.resolvers.total.name}: Int`);
      queryResolvers[options.resolvers.total.name] = options.resolvers.total.resolver;
    }
    Telescope.graphQL.addResolvers({ Query: { ...queryResolvers } });
  }

  // ------------------------------------- Mutations -------------------------------- //

  if (options.mutations) {
    const mutations = {};
    // new
    if (options.mutations.new) { // e.g. "moviesNew(document: moviesInput) : Movie"
      Telescope.graphQL.addMutation(`${options.mutations.new.name}(document: ${options.collectionName}Input) : ${options.typeName}`);
      mutations[options.mutations.new.name] = options.mutations.new.mutation.bind(options.mutations.new);
    }
    // edit
    if (options.mutations.edit) { // e.g. "moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie"
      Telescope.graphQL.addMutation(`${options.mutations.edit.name}(documentId: String, set: ${options.collectionName}Input, unset: ${options.collectionName}Unset) : ${options.typeName}`);
      mutations[options.mutations.edit.name] = options.mutations.edit.mutation.bind(options.mutations.edit);
    }
    // remove
    if (options.mutations.remove) { // e.g. "moviesRemove(documentId: String) : Movie"
      Telescope.graphQL.addMutation(`${options.mutations.remove.name}(documentId: String) : ${options.typeName}`);
      mutations[options.mutations.remove.name] = options.mutations.remove.mutation.bind(options.mutations.remove);
    }
    Telescope.graphQL.addResolvers({ Mutation: { ...mutations } });
  }
  
  return collection;
}