import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { GraphQLSchema } from './graphql.js';
import { Utils } from './utils.js';
import { runCallbacks } from './callbacks.js';

SimpleSchema.extendOptions({
  viewableBy: Match.Optional(Match.OneOf(Function, [String])),
  insertableBy: Match.Optional(Match.OneOf(Function, [String])),
  editableBy: Match.Optional(Match.OneOf(Function, [String])),
  resolveAs: Match.Optional(String),
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
 * @summary Add a default view function.
 * @param {Function} view
 */
Mongo.Collection.prototype.addDefaultView = function (view) {
  this.defaultView = view;
};

/**
 * @summary Add a named view function.
 * @param {String} viewName
 * @param {Function} view
 */
Mongo.Collection.prototype.addView = function (viewName, view) {
  this.views[viewName] = view;
};

export const createCollection = options => {

  const {collectionName, typeName, schema, resolvers, mutations, generateGraphQLSchema = true } = options;

  // initialize new Mongo collection
  const collection = collectionName === 'users' ? Meteor.users : new Mongo.Collection(collectionName);

  // decorate collection with options
  collection.options = options;

  // add typeName
  collection.typeName = typeName;

  // add views
  collection.views = [];

  if (schema) {
    // attach schema to collection
    collection.attachSchema(new SimpleSchema(schema));
  }

  // add collection to resolver context
  const context = {};
  context[Utils.capitalize(collectionName)] = collection;
  GraphQLSchema.addToContext(context);

  if (generateGraphQLSchema){
      
    // add collection to list of dynamically generated GraphQL schemas
    GraphQLSchema.addCollection(collection);


    // ------------------------------------- Queries -------------------------------- //
    
    if (resolvers) {
      const queryResolvers = {};
      // list
      if (resolvers.list) { // e.g. ""
        GraphQLSchema.addQuery(`${resolvers.list.name}(terms: JSON, offset: Int, limit: Int): [${typeName}]`);
        queryResolvers[resolvers.list.name] = resolvers.list.resolver;
      }
      // single
      if (resolvers.single) {
        GraphQLSchema.addQuery(`${resolvers.single.name}(documentId: String, slug: String): ${typeName}`);
        queryResolvers[resolvers.single.name] = resolvers.single.resolver;
      }
      // total
      if (resolvers.total) {
        GraphQLSchema.addQuery(`${resolvers.total.name}(terms: JSON): Int`);
        queryResolvers[resolvers.total.name] = resolvers.total.resolver;
      }
      GraphQLSchema.addResolvers({ Query: { ...queryResolvers } });
    }

    // ------------------------------------- Mutations -------------------------------- //

    if (mutations) {
      const mutations = {};
      // new
      if (mutations.new) { // e.g. "moviesNew(document: moviesInput) : Movie"
        GraphQLSchema.addMutation(`${mutations.new.name}(document: ${collectionName}Input) : ${typeName}`);
        mutations[mutations.new.name] = mutations.new.mutation.bind(mutations.new);
      }
      // edit
      if (mutations.edit) { // e.g. "moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie"
        GraphQLSchema.addMutation(`${mutations.edit.name}(documentId: String, set: ${collectionName}Input, unset: ${collectionName}Unset) : ${typeName}`);
        mutations[mutations.edit.name] = mutations.edit.mutation.bind(mutations.edit);
      }
      // remove
      if (mutations.remove) { // e.g. "moviesRemove(documentId: String) : Movie"
        GraphQLSchema.addMutation(`${mutations.remove.name}(documentId: String) : ${typeName}`);
        mutations[mutations.remove.name] = mutations.remove.mutation.bind(mutations.remove);
      }
      GraphQLSchema.addResolvers({ Mutation: { ...mutations } });
    }
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
    parameters = runCallbacks(`${collectionName}.parameters`, parameters, _.clone(terms), apolloClient);

    // extend sort to sort posts by _id to break ties
    // NOTE: always do this last to avoid _id sort overriding another sort
    parameters = Utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});

    // console.log(parameters);

    return parameters;
  }

  return collection;
}
