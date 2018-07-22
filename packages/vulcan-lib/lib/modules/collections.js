import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { addGraphQLCollection, addGraphQLQuery, addGraphQLMutation, addGraphQLResolvers, addToGraphQLContext } from './graphql.js';
import { Utils } from './utils.js';
import { runCallbacks } from './callbacks.js';
import { getSetting, registerSetting } from './settings.js';
import { registerFragment, getDefaultFragmentText } from './fragments.js';
import escapeStringRegexp from 'escape-string-regexp';
import { isIntlField } from './intl.js';
const wrapAsync = (Meteor.wrapAsync)? Meteor.wrapAsync : Meteor._wrapAsync;
// import { debug } from './debug.js';

registerSetting('maxDocumentsPerRequest', 5000, 'Maximum documents per request');

export const Collections = [];

export const getCollection = name => Collections.find(({ options: { collectionName }}) => name === collectionName);

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

/**
 * @summary Allow mongodb aggregation
 * @param {Array} pipelines mongodb pipeline
 * @param {Object} options mongodb option object 
 */
Mongo.Collection.prototype.aggregate = function (pipelines, options) {
  var coll = this.rawCollection();
  return wrapAsync(coll.aggregate.bind(coll))(pipelines, options);
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

  // generate foo_intl fields
  Object.keys(schema).forEach(fieldName => {
    const fieldSchema = schema[fieldName];
    if (fieldSchema.type && fieldSchema.type.name === 'IntlString') {
      // make non-intl field optional
      schema[fieldName].optional = true;

      schema[`${fieldName}_intl`] = {
        ...schema[fieldName], // copy properties from regular field
        hidden: true,
        type: Array,
      }
      schema[`${fieldName}_intl.$`] = {
        type: Object,
        blackbox: true,
      }
    }
  });

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
        addGraphQLQuery(
`${resolvers.list.name}(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON, 
    # How much to offset the results by
    offset: Int, 
    # A limit for the query
    limit: Int, 
    # Whether to enable caching for this query
    enableCache: Boolean
  ): [${typeName}]`, resolvers.list.description);
        queryResolvers[resolvers.list.name] = resolvers.list.resolver.bind(resolvers.list);
      }
      // single
      if (resolvers.single) {
        addGraphQLQuery(
`${resolvers.single.name}(
    # The document's unique ID
    documentId: String, 
    # A unique slug identifying the document
    slug: String, 
    # Whether to enable caching for this query
    enableCache: Boolean
  ): ${typeName}`, resolvers.single.description);
        queryResolvers[resolvers.single.name] = resolvers.single.resolver.bind(resolvers.single);
      }
      // total
      if (resolvers.total) {
        addGraphQLQuery(
`${resolvers.total.name}(
    # A JSON object that contains the query terms used to fetch data
    terms: JSON,
    # Whether to enable caching for this query
    enableCache: Boolean
  ): Int`, resolvers.total.description);
        queryResolvers[resolvers.total.name] = resolvers.total.resolver;
      }
      addGraphQLResolvers({ Query: { ...queryResolvers } });
    }

    // ------------------------------------- Mutations -------------------------------- //

    if (mutations) {
      const mutationResolvers = {};
      // new
      if (mutations.new) { // e.g. "moviesNew(document: moviesInput) : Movie"
        addGraphQLMutation(
`${mutations.new.name}(
    # The document to insert
    document: ${collectionName}Input
  ) : ${typeName}`, mutations.new.description);
        mutationResolvers[mutations.new.name] = mutations.new.mutation.bind(mutations.new);
      }
      // edit
      if (mutations.edit) { // e.g. "moviesEdit(documentId: String, set: moviesInput, unset: moviesUnset) : Movie"
        addGraphQLMutation(
`${mutations.edit.name}(
    # The unique ID of the document to edit
    documentId: String, 
    # An array of fields to insert
    set: ${collectionName}Input, 
    # An array of fields to delete
    unset: ${collectionName}Unset
  ) : ${typeName}`, mutations.edit.description);
        mutationResolvers[mutations.edit.name] = mutations.edit.mutation.bind(mutations.edit);
      }
      // upsert
      if (mutations.upsert) { // e.g. "moviesUpsert(search: moviesInput, set: moviesInput, unset: moviesUnset) : Movie"
        addGraphQLMutation(
          `${mutations.upsert.name}(
    # The document to search for (or partial document)
    search: JSON, 
    # An array of fields to insert
    set: ${collectionName}Input, 
    # An array of fields to delete
    unset: ${collectionName}Unset
  ) : ${typeName}`, mutations.upsert.description);
        mutationResolvers[mutations.upsert.name] = mutations.upsert.mutation.bind(mutations.upsert);
      }
      // remove
      if (mutations.remove) { // e.g. "moviesRemove(documentId: String) : Movie"
        addGraphQLMutation(
`${mutations.remove.name}(
    # The unique ID of the document to delete
    documentId: String
  ) : ${typeName}`, mutations.remove.description);
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

    // console.log(terms);

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

    // note: check that context exists to avoid calling this from withList during SSR
    if (Meteor.isServer && context) {
      parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters.server`, parameters, _.clone(terms), context);
    }

    // if there is no sort, default to sorting by createdAt descending
    if (!parameters.options.sort) {
      parameters.options.sort = { createdAt: -1 };
    }

    // extend sort to sort posts by _id to break ties, unless there's already an id sort
    // NOTE: always do this last to avoid overriding another sort
    if (!(parameters.options.sort && typeof parameters.options.sort._id !== undefined)) {
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
      if (searchableFieldNames.length) {
        parameters = Utils.deepExtend(true, parameters, {
          selector: {
            $or: searchableFieldNames.map(fieldName => ({[fieldName]: {$regex: query, $options: 'i'}}))
          }
        });
      }
    }

    // limit number of items to 1000 by default
    const maxDocuments = getSetting('maxDocumentsPerRequest', 1000);
    const limit = terms.limit || parameters.options.limit;
    parameters.options.limit = (!limit || limit < 1 || limit > maxDocuments) ? maxDocuments : limit;

    // console.log(parameters);

    return parameters;
  }

  Collections.push(collection);

  return collection;
}
