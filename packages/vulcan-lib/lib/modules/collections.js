import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { GraphQLSchema } from './graphql.js';
import { Utils } from './utils.js';
import { runCallbacks } from './callbacks.js';

export const Collections = [];

SimpleSchema.extendOptions([
  'viewableBy',
  'insertableBy',
  'editableBy',
  'resolveAs',
]);

/**
 * @summary replacement for Collection2's attachSchema. Pass either a schema, to
 * initialize or replace the schema, or some fields, to extend the current schema
 * @class Mongo.Collection
 */
Mongo.Collection.prototype.attachSchema = function (schemaOrFields) {
  if (schemaOrFields instanceof SimpleSchema) {
    this.simpleSchema = () => schemaOrFields;
  } else {
    this.simpleSchema().extend(schemaOrFields)
  }
}

/**
 * @summary Add an additional field (or an array of fields) to a schema.
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
  collection.attachSchema(new SimpleSchema(schema));
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

// see https://github.com/dburles/meteor-collection-helpers/blob/master/collection-helpers.js
Mongo.Collection.prototype.helpers = function(helpers) {
  var self = this;

  if (self._transform && ! self._helpers)
    throw new Meteor.Error("Can't apply helpers to '" +
      self._name + "' a transform function already exists!");

  if (! self._helpers) {
    self._helpers = function Document(doc) { return _.extend(this, doc); };
    self._transform = function(doc) {
      return new self._helpers(doc);
    };
  }

  _.each(helpers, function(helper, key) {
    self._helpers.prototype[key] = helper;
  });
};

export const createCollection = options => {

  const {collectionName, typeName, schema, resolvers, mutations, generateGraphQLSchema = true, dbCollectionName } = options;

  // initialize new Mongo collection
  const collection = collectionName === 'Users' ? Meteor.users : new Mongo.Collection(dbCollectionName ? dbCollectionName : collectionName.toLowerCase());

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
  context[collectionName] = collection;
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
        queryResolvers[resolvers.list.name] = resolvers.list.resolver.bind(resolvers.list);
      }
      // single
      if (resolvers.single) {
        GraphQLSchema.addQuery(`${resolvers.single.name}(documentId: String, slug: String): ${typeName}`);
        queryResolvers[resolvers.single.name] = resolvers.single.resolver.bind(resolvers.single);
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
      const mutationResolvers = {};
      // new
      if (mutations.new) { // e.g. "moviesNew(document: moviesInput) : Movie"
        GraphQLSchema.addMutation(`${mutations.new.name}(document: ${collectionName}Input) : ${typeName}`);
        mutationResolvers[mutations.new.name] = mutations.new.mutation.bind(mutations.new);
      }
      // edit
      if (mutations.edit) { // e.g. "moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie"
        GraphQLSchema.addMutation(`${mutations.edit.name}(documentId: String, set: ${collectionName}Input, unset: ${collectionName}Unset) : ${typeName}`);
        mutationResolvers[mutations.edit.name] = mutations.edit.mutation.bind(mutations.edit);
      }
      // remove
      if (mutations.remove) { // e.g. "moviesRemove(documentId: String) : Movie"
        GraphQLSchema.addMutation(`${mutations.remove.name}(documentId: String) : ${typeName}`);
        mutationResolvers[mutations.remove.name] = mutations.remove.mutation.bind(mutations.remove);
      }
      GraphQLSchema.addResolvers({ Mutation: { ...mutationResolvers } });
    }
  }

  // ------------------------------------- Parameters -------------------------------- //

  collection.getParameters = (terms = {}, apolloClient, currentUser) => {

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
    parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters`, parameters, _.clone(terms), apolloClient);

    // extend sort to sort posts by _id to break ties
    // NOTE: always do this last to avoid overriding another sort
    parameters = Utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});

    // remove any null fields (setting a field to null means it should be deleted)
    _.keys(parameters.selector).forEach(key => {
      if (parameters.selector[key] === null) delete parameters.selector[key];
    });
    _.keys(parameters.options).forEach(key => {
      if (parameters.options[key] === null) delete parameters.options[key];
    });
    
    // limit number of items to 200
    parameters.options.limit = (terms.limit < 1 || terms.limit > 200) ? 200 : terms.limit;

    // limit fields to viewable fields
    if (currentUser) {
      parameters.options.fields = currentUser.getViewableFields(collection);
    }

    // console.log(parameters);

    return parameters;
  }

  Collections.push(collection);

  return collection;
}