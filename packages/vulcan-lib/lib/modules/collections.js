import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { addGraphQLCollection, addGraphQLQuery, addGraphQLMutation, addGraphQLResolvers, addToGraphQLContext } from './graphql.js';
import { Utils } from './utils.js';
import { runCallbacks } from './callbacks.js';
import { getSetting, registerSetting } from './settings.js';
import { registerFragment, getDefaultFragmentText } from './fragments.js';
import escapeStringRegexp from 'escape-string-regexp';
import { debug } from './debug.js';

registerSetting('maxDocumentsPerRequest', 1000, 'Maximum documents per request');

export const Collections = [];

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
  addToGraphQLContext(context);

  if (generateGraphQLSchema){

    // add collection to list of dynamically generated GraphQL schemas
    addGraphQLCollection(collection);


    // ------------------------------------- Queries -------------------------------- //

    if (resolvers) {
      const queryResolvers = {};
      // list
      if (resolvers.list) { // e.g. ""
        addGraphQLQuery(`${resolvers.list.name}(terms: JSON, offset: Int, limit: Int, enableCache: Boolean): [${typeName}]`);
        queryResolvers[resolvers.list.name] = resolvers.list.resolver.bind(resolvers.list);
      }
      // single
      if (resolvers.single) {
        addGraphQLQuery(`${resolvers.single.name}(documentId: String, slug: String, enableCache: Boolean): ${typeName}`);
        queryResolvers[resolvers.single.name] = resolvers.single.resolver.bind(resolvers.single);
      }
      // total
      if (resolvers.total) {
        addGraphQLQuery(`${resolvers.total.name}(terms: JSON, enableCache: Boolean): Int`);
        queryResolvers[resolvers.total.name] = resolvers.total.resolver;
      }
      addGraphQLResolvers({ Query: { ...queryResolvers } });
    }

    // ------------------------------------- Mutations -------------------------------- //

    if (mutations) {
      const mutationResolvers = {};
      // new
      if (mutations.new) { // e.g. "moviesNew(document: moviesInput) : Movie"
        addGraphQLMutation(`${mutations.new.name}(document: ${collectionName}Input) : ${typeName}`);
        mutationResolvers[mutations.new.name] = mutations.new.mutation.bind(mutations.new);
      }
      // edit
      if (mutations.edit) { // e.g. "moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie"
        addGraphQLMutation(`${mutations.edit.name}(documentId: String, set: ${collectionName}Input, unset: ${collectionName}Unset) : ${typeName}`);
        mutationResolvers[mutations.edit.name] = mutations.edit.mutation.bind(mutations.edit);
      }
      // remove
      if (mutations.remove) { // e.g. "moviesRemove(documentId: String) : Movie"
        addGraphQLMutation(`${mutations.remove.name}(documentId: String) : ${typeName}`);
        mutationResolvers[mutations.remove.name] = mutations.remove.mutation.bind(mutations.remove);
      }
      addGraphQLResolvers({ Mutation: { ...mutationResolvers } });
    }
  }

  // ------------------------------------- Default Fragment -------------------------------- //

  const defaultFragment = getDefaultFragmentText(collection);
  if (defaultFragment) registerFragment(defaultFragment);

  // ------------------------------------- Parameters -------------------------------- //

  collection.getParameters = (terms = {}, apolloClient, context) => {

    // debug(terms);

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
      parameters = Utils.deepExtend(true, parameters, view(terms, apolloClient, context));
    }

    // iterate over posts.parameters callbacks
    parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters`, parameters, _.clone(terms), apolloClient, context);

    if (Meteor.isClient) {
      parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters.client`, parameters, _.clone(terms), apolloClient);
    }

    if (Meteor.isServer) {
      parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters.server`, parameters, _.clone(terms), context);
    }

    // extend sort to sort posts by _id to break ties, unless there's already an id sort
    // NOTE: always do this last to avoid overriding another sort
    if (!(parameters.options.sort && parameters.options.sort._id)) {
      parameters = Utils.deepExtend(true, parameters, {options: {sort: {_id: -1}}});
    }

    // remove any null fields (setting a field to null means it should be deleted)
    _.keys(parameters.selector).forEach(key => {
      if (parameters.selector[key] === null) delete parameters.selector[key];
    });
    if (parameters.options.sort) {
      _.keys(parameters.options.sort).forEach(key => {
        if (parameters.options.sort[key] === null) delete parameters.options.sort[key];
      });
    }

    if(terms.query) {
        
      const query = escapeStringRegexp(terms.query);

      const searchableFieldNames = _.filter(_.keys(schema), fieldName => schema[fieldName].searchable);
      parameters = Utils.deepExtend(true, parameters, {
        selector: {
          $or: searchableFieldNames.map(fieldName => ({[fieldName]: {$regex: query, $options: 'i'}}))
        }
      });
    }

    // limit number of items to 200 by default
    const maxDocuments = getSetting('maxDocumentsPerRequest', 1000);
    parameters.options.limit = (!terms.limit || terms.limit < 1 || terms.limit > maxDocuments) ? maxDocuments : terms.limit;

    // debug(parameters);

    return parameters;
  }

  Collections.push(collection);

  return collection;
}