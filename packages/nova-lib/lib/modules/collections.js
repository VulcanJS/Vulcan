import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { GraphQLSchema } from './graphql.js';
import { Utils } from './utils.js';
import { runCallbacks } from './callbacks.js';

SimpleSchema.extendOptions({
  // kept for backward compatibility?
  // viewableIf: Match.Optional(Match.OneOf(Function, [String])),
  // insertableIf: Match.Optional(Match.OneOf(Function, [String])),
  // editableIf: Match.Optional(Match.OneOf(Function, [String])),
  viewableBy: Match.Optional(Match.OneOf(Function, [String])),
  insertableBy: Match.Optional(Match.OneOf(Function, [String])),
  editableBy: Match.Optional(Match.OneOf(Function, [String])),
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

  const collection = this;
  const schema = collection.simpleSchema()._schema;
  const fieldSchema = {};

  const fieldArray = Array.isArray(fieldOrFieldArray) ? fieldOrFieldArray : [fieldOrFieldArray];

  // loop over fields and add them to schema (or extend existing fields)
  fieldArray.forEach(function (field) {
    const newField = {...schema[field.fieldName], ...field.fieldSchema};
    fieldSchema[field.fieldName] = newField;
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
 */

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
 */
Mongo.Collection.prototype.getPublicFields = function () {
  var schema = this.simpleSchema()._schema;
  var fields = _.filter(_.keys(schema), function (fieldName) {
    var field = schema[fieldName];
    return field.publish === true;
  });
  return fields;
};


Mongo.Collection.prototype.addDefaultView = function (view) {
  this.defaultView = view;
};

Mongo.Collection.prototype.addView = function (viewName, view) {
  this.views[viewName] = view;
};

export const createCollection = options => {

  // initialize new Mongo collection
  const collection = options.collectionName === 'users' ? Meteor.users : new Mongo.Collection(options.collectionName);

  // decorate collection with options
  collection.options = options;

  // add typeName
  collection.typeName = options.typeName;

  // add views
  collection.views = [];

  if (options.schema) {
    // attach schema to collection
    collection.attachSchema(new SimpleSchema(options.schema));
  }

  // add collection to list of dynamically generated GraphQL schemas
  GraphQLSchema.addCollection(collection);

  // add collection to resolver context
  const context = {};
  context[Utils.capitalize(options.collectionName)] = collection;
  GraphQLSchema.addToContext(context);

  // ------------------------------------- Queries -------------------------------- //
  
  if (options.resolvers) {
    const queryResolvers = {};
    // list
    if (options.resolvers.list) { // e.g. ""
      GraphQLSchema.addQuery(`${options.resolvers.list.name}(terms: JSON, offset: Int, limit: Int): [${options.typeName}]`);
      queryResolvers[options.resolvers.list.name] = options.resolvers.list.resolver;
    }
    // single
    if (options.resolvers.single) {
      GraphQLSchema.addQuery(`${options.resolvers.single.name}(documentId: String, slug: String): ${options.typeName}`);
      queryResolvers[options.resolvers.single.name] = options.resolvers.single.resolver;
    }
    // total
    if (options.resolvers.total) {
      GraphQLSchema.addQuery(`${options.resolvers.total.name}(terms: JSON): Int`);
      queryResolvers[options.resolvers.total.name] = options.resolvers.total.resolver;
    }
    GraphQLSchema.addResolvers({ Query: { ...queryResolvers } });
  }

  // ------------------------------------- Mutations -------------------------------- //

  if (options.mutations) {
    const mutations = {};
    // new
    if (options.mutations.new) { // e.g. "moviesNew(document: moviesInput) : Movie"
      GraphQLSchema.addMutation(`${options.mutations.new.name}(document: ${options.collectionName}Input) : ${options.typeName}`);
      mutations[options.mutations.new.name] = options.mutations.new.mutation.bind(options.mutations.new);
    }
    // edit
    if (options.mutations.edit) { // e.g. "moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie"
      GraphQLSchema.addMutation(`${options.mutations.edit.name}(documentId: String, set: ${options.collectionName}Input, unset: ${options.collectionName}Unset) : ${options.typeName}`);
      mutations[options.mutations.edit.name] = options.mutations.edit.mutation.bind(options.mutations.edit);
    }
    // remove
    if (options.mutations.remove) { // e.g. "moviesRemove(documentId: String) : Movie"
      GraphQLSchema.addMutation(`${options.mutations.remove.name}(documentId: String) : ${options.typeName}`);
      mutations[options.mutations.remove.name] = options.mutations.remove.mutation.bind(options.mutations.remove);
    }
    GraphQLSchema.addResolvers({ Mutation: { ...mutations } });
  }
  
  // ------------------------------------- Parameters -------------------------------- //

  collection.getParameters = (terms = {}, apolloClient) => {

    // console.log(terms)

    let parameters = {
      selector: {},
      options: {}
    };

    if (collection.defaultView) {
      parameters = Utils.deepExtend(true, parameters, collection.defaultView(terms, apolloClient));
    }

    // handle view option
    if (terms.view && collection.views[terms.view]) {
      const view = collection.views[terms.view];
      parameters = Utils.deepExtend(true, parameters, view(terms, apolloClient));
    }

    // iterate over posts.parameters callbacks
    parameters = runCallbacks(`${options.collectionName}.parameters`, parameters, _.clone(terms), apolloClient);

    // extend sort to sort posts by _id to break ties
    // NOTE: always do this last to avoid _id sort overriding another sort
    parameters = Utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});

    // console.log(parameters);

    return parameters;
  }

  return collection;
}
