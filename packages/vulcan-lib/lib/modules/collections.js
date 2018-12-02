import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { addGraphQLCollection, addToGraphQLContext } from './graphql.js';
import { Utils } from './utils.js';
import { runCallbacks, runCallbacksAsync } from './callbacks.js';
import { getSetting, registerSetting } from './settings.js';
import { registerFragment, getDefaultFragmentText } from './fragments.js';
import escapeStringRegexp from 'escape-string-regexp';
import { validateIntlField, getIntlString, isIntlField } from './intl';

const wrapAsync = Meteor.wrapAsync ? Meteor.wrapAsync : Meteor._wrapAsync;
// import { debug } from './debug.js';

registerSetting('maxDocumentsPerRequest', 1000, 'Maximum documents per request');

// will be set to `true` if there is one or more intl schema fields
export let hasIntlFields = false;

export const Collections = [];

export const getCollection = name =>
  Collections.find(
    ({ options: { collectionName } }) => name === collectionName || name === collectionName.toLowerCase()
  );

// TODO: find more reliable way to get collection name from type name?
export const getCollectionName = typeName => Utils.pluralize(typeName);

// TODO: find more reliable way to get type name from collection name?
export const getTypeName = collectionName => collectionName.slice(0, -1);

/**
 * @summary replacement for Collection2's attachSchema. Pass either a schema, to
 * initialize or replace the schema, or some fields, to extend the current schema
 * @class Mongo.Collection
 */
Mongo.Collection.prototype.attachSchema = function(schemaOrFields) {
  if (schemaOrFields instanceof SimpleSchema) {
    this.simpleSchema = () => schemaOrFields;
  } else {
    this.simpleSchema().extend(schemaOrFields);
  }
};

/**
 * @summary Add an additional field (or an array of fields) to a schema.
 * @param {Object|Object[]} field
 */
Mongo.Collection.prototype.addField = function(fieldOrFieldArray) {
  const collection = this;
  const fieldSchema = {};

  const fieldArray = Array.isArray(fieldOrFieldArray) ? fieldOrFieldArray : [fieldOrFieldArray];

  // loop over fields and add them to schema (or extend existing fields)
  fieldArray.forEach(function(field) {
    fieldSchema[field.fieldName] = field.fieldSchema;
  });

  // add field schema to collection schema
  collection.attachSchema(fieldSchema);
};

/**
 * @summary Remove a field from a schema.
 * @param {String} fieldName
 */
Mongo.Collection.prototype.removeField = function(fieldName) {
  var collection = this;
  var schema = _.omit(collection.simpleSchema()._schema, fieldName);

  // add field schema to collection schema
  collection.attachSchema(new SimpleSchema(schema));
};

/**
 * @summary Add a default view function.
 * @param {Function} view
 */
Mongo.Collection.prototype.addDefaultView = function(view) {
  this.defaultView = view;
};

/**
 * @summary Add a named view function.
 * @param {String} viewName
 * @param {Function} view
 */
Mongo.Collection.prototype.addView = function(viewName, view) {
  this.views[viewName] = view;
};

/**
 * @summary Allow mongodb aggregation
 * @param {Array} pipelines mongodb pipeline
 * @param {Object} options mongodb option object
 */
Mongo.Collection.prototype.aggregate = function(pipelines, options) {
  var coll = this.rawCollection();
  return wrapAsync(coll.aggregate.bind(coll))(pipelines, options);
};

// see https://github.com/dburles/meteor-collection-helpers/blob/master/collection-helpers.js
Mongo.Collection.prototype.helpers = function(helpers) {
  var self = this;

  if (self._transform && !self._helpers)
    throw new Meteor.Error('Can\'t apply helpers to \'' + self._name + '\' a transform function already exists!');

  if (!self._helpers) {
    self._helpers = function Document(doc) {
      return _.extend(this, doc);
    };
    self._transform = function(doc) {
      return new self._helpers(doc);
    };
  }

  _.each(helpers, function(helper, key) {
    self._helpers.prototype[key] = helper;
  });
};

export const createCollection = options => {
  const {
    typeName,
    collectionName = getCollectionName(typeName),
    schema,
    generateGraphQLSchema = true,
    dbCollectionName
  } = options;

  // initialize new Mongo collection
  const collection =
    collectionName === 'Users' && Meteor.users
      ? Meteor.users
      : new Mongo.Collection(dbCollectionName ? dbCollectionName : collectionName.toLowerCase());

  // decorate collection with options
  collection.options = options;

  // add typeName if missing
  collection.typeName = typeName;
  collection.options.typeName = typeName;
  collection.options.singleResolverName = Utils.camelCaseify(typeName);
  collection.options.multiResolverName = Utils.camelCaseify(Utils.pluralize(typeName));

  // add collectionName if missing
  collection.collectionName = collectionName;
  collection.options.collectionName = collectionName;

  // add views
  collection.views = [];

  // generate foo_intl fields
  Object.keys(schema).forEach(fieldName => {
    const fieldSchema = schema[fieldName];
    if (isIntlField(fieldSchema)) {
      // we have at least one intl field
      hasIntlFields = true;

      // remove `intl` to avoid treating new _intl field as a field to internationalize
      // eslint-disable-next-line no-unused-vars
      const { intl, ...propertiesToCopy } = schema[fieldName];

      schema[`${fieldName}_intl`] = {
        ...propertiesToCopy, // copy properties from regular field
        hidden: true,
        type: Array,
        isIntlData: true
      };

      delete schema[`${fieldName}_intl`].intl;

      schema[`${fieldName}_intl.$`] = {
        type: getIntlString()
      };

      // if original field is required, enable custom validation function instead of `optional` property
      if (!schema[fieldName].optional) {
        schema[`${fieldName}_intl`].optional = true;
        schema[`${fieldName}_intl`].custom = validateIntlField;
      }

      // make original non-intl field optional
      schema[fieldName].optional = true;
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

  if (generateGraphQLSchema) {
    // add collection to list of dynamically generated GraphQL schemas
    addGraphQLCollection(collection);
  }

  runCallbacksAsync({ name: '*.collection', properties: { options } });
  runCallbacksAsync({ name: `${collectionName}.collection`, properties: { options } });

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
      parameters = Utils.deepExtend(true, parameters, collection.defaultView(terms, apolloClient, context));
    }

    // handle view option
    if (terms.view && collection.views[terms.view]) {
      const view = collection.views[terms.view];
      parameters = Utils.deepExtend(true, parameters, view(terms, apolloClient, context));
    }

    // iterate over posts.parameters callbacks
    parameters = runCallbacks(
      `${typeName.toLowerCase()}.parameters`,
      parameters,
      _.clone(terms),
      apolloClient,
      context
    );
    // OpenCRUD backwards compatibility
    parameters = runCallbacks(
      `${collectionName.toLowerCase()}.parameters`,
      parameters,
      _.clone(terms),
      apolloClient,
      context
    );

    if (Meteor.isClient) {
      parameters = runCallbacks(
        `${typeName.toLowerCase()}.parameters.client`,
        parameters,
        _.clone(terms),
        apolloClient
      );
      // OpenCRUD backwards compatibility
      parameters = runCallbacks(
        `${collectionName.toLowerCase()}.parameters.client`,
        parameters,
        _.clone(terms),
        apolloClient
      );
    }

    // note: check that context exists to avoid calling this from withList during SSR
    if (Meteor.isServer && context) {
      parameters = runCallbacks(`${typeName.toLowerCase()}.parameters.server`, parameters, _.clone(terms), context);
      // OpenCRUD backwards compatibility
      parameters = runCallbacks(
        `${collectionName.toLowerCase()}.parameters.server`,
        parameters,
        _.clone(terms),
        context
      );
    }

    // sort using terms.orderBy (overwrite defaultView's sort)
    if (terms.orderBy && !_.isEmpty(terms.orderBy)) {
      parameters.options.sort = terms.orderBy;
    }

    // if there is no sort, default to sorting by createdAt descending
    if (!parameters.options.sort) {
      parameters.options.sort = { createdAt: -1 };
    }

    // extend sort to sort posts by _id to break ties, unless there's already an id sort
    // NOTE: always do this last to avoid overriding another sort
    if (!(parameters.options.sort && parameters.options.sort._id)) {
      parameters = Utils.deepExtend(true, parameters, { options: { sort: { _id: -1 } } });
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

    if (terms.query) {
      const query = escapeStringRegexp(terms.query);
      const currentSchema = collection.simpleSchema()._schema;
      const searchableFieldNames = _.filter(_.keys(currentSchema), fieldName => currentSchema[fieldName].searchable);
      if (searchableFieldNames.length) {
        parameters = Utils.deepExtend(true, parameters, {
          selector: {
            $or: searchableFieldNames.map(fieldName => ({ [fieldName]: { $regex: query, $options: 'i' } }))
          }
        });
      } else {
        // eslint-disable-next-line no-console
        console.warn(
          `Warning: terms.query is set but schema ${
            collection.options.typeName
          } has no searchable field. Set "searchable: true" for at least one field to enable search.`
        );
      }
    }

    // limit number of items to 1000 by default
    const maxDocuments = getSetting('maxDocumentsPerRequest', 1000);
    const limit = terms.limit || parameters.options.limit;
    parameters.options.limit = !limit || limit < 1 || limit > maxDocuments ? maxDocuments : limit;

    // console.log(parameters);

    return parameters;
  };

  Collections.push(collection);

  return collection;
};
