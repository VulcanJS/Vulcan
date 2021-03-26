import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Utils } from './utils.js';
import { runCallbacks, runCallbacksAsync, registerCallback, addCallback } from './callbacks.js';
import { getSetting, registerSetting } from './settings.js';
import { registerFragment } from './fragments.js';
import { getDefaultFragmentText } from './graphql/defaultFragment';
import escapeStringRegexp from 'escape-string-regexp';
import { validateIntlField, getIntlString, isIntlField, schemaHasIntlFields, schemaHasIntlField } from './intl';
import clone from 'lodash/clone';
import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import _omit from 'lodash/omit';
import mergeWith from 'lodash/mergeWith';
import { createSchema, isCollectionType } from './schema_utils.js';

const wrapAsync = Meteor.wrapAsync ? Meteor.wrapAsync : Meteor._wrapAsync;
// import { debug } from './debug.js';

registerSetting('maxDocumentsPerRequest', 1000, 'Maximum documents per request');

// will be set to `true` if there is one or more intl schema fields
export let hasIntlFields = false;

export const Collections = [];

export const getCollection = name => {
  const collection = Collections.find(
    ({ options: { collectionName } }) => name === collectionName || name === collectionName.toLowerCase()
  );
  if (!collection) {
    throw new Error(`Could not find collection named “${name}”`);
  }
  return collection;
};

export const getCollectionByTypeName = typeName => {
  // in case typeName is for an array ('[User!]'), get rid of brackets
  let parsedTypeName = typeName.replace('[', '').replace(']', '').replace(/!/g, '');
  const collection = Collections.find(({ options: { typeName } }) => parsedTypeName === typeName);
  if (!collection) {
    throw new Error(`Could not find collection for type “${parsedTypeName}”. Registered types: ${Collections.map(({ options: { typeName } }) => typeName).join(', ')}`);
  }
  return collection;
};

export const generateCollectionNameFromTypeName = typeName => Utils.pluralize(typeName);

export const getTypeNameByCollectionName = collectionName => {
  const collection = Collections.find(({ options }) => options.collectionName === collectionName);
  if (!collection) {
    throw new Error(`Could not find type for collection “${collectionName}”`);
  }
  return collection.options.typeName;
};

export const generateTypeNameFromCollectionName = collectionName => Utils.singularize(collectionName);

/**
 * @summary replacement for Collection2's attachSchema. Pass either a schema, to
 * initialize or replace the schema, or some fields, to extend the current schema
 * @class Mongo.Collection
 */
Mongo.Collection.prototype.attachSchema = function (schemaOrFields) {
  if (schemaOrFields instanceof SimpleSchema) {
    this.simpleSchema = () => schemaOrFields;
  } else {
    this.simpleSchema().extend(schemaOrFields);
  }
};

/**
 * @summary Add an additional field (or an array of fields) to a schema.
 * @param {Object|Object[]} fieldOrFieldArray
 */
Mongo.Collection.prototype.addField = function (fieldOrFieldArray) {
  const collection = this;
  const fieldSchema = {};

  const fieldArray = Array.isArray(fieldOrFieldArray) ? fieldOrFieldArray : [fieldOrFieldArray];

  // loop over fields and add them to schema (or extend existing fields)
  fieldArray.forEach(function (field) {
    fieldSchema[field.fieldName] = field.fieldSchema;
  });

  // add field schema to collection schema
  collection.attachSchema(createSchema(merge(collection.options.schema, fieldSchema)));
};

/**
 * @summary Remove a field from a schema.
 * @param {String} fieldName
 */
Mongo.Collection.prototype.removeField = function (fieldName) {
  var collection = this;
  var schema = _omit(collection.simpleSchema()._schema, fieldName);

  // add field schema to collection schema
  collection.attachSchema(createSchema(schema));
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
Mongo.Collection.prototype.helpers = function (helpers) {
  var self = this;

  if (self._transform && !self._helpers)
    throw new Meteor.Error(
      "Can't apply helpers to '" + self._name + "' a transform function already exists!"
    );

  if (!self._helpers) {
    self._helpers = function Document(doc) {
      return Object.assign(this, doc);
    };
    self._transform = function (doc) {
      return new self._helpers(doc);
    };
  }

  Object.keys(helpers).forEach(function (key) {
    self._helpers.prototype[key] = helpers[key];
  });
};

export const extendCollection = (collection, options) => {
  const newOptions = mergeWith({}, collection.options, options, (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.concat(b);
    }
    if (Array.isArray(a) && b) {
      return a.concat([b]);
    }
    if (Array.isArray(b) && a) {
      return b.concat([a]);
    }
  });
  collection = createCollection(newOptions);
  return collection;
};

/*

Note: this currently isn't used because it would need to be called
after all collections have been initialized, otherwise we can't figure out
if resolved field is resolving to a collection type or not

*/
export const addAutoRelations = () => {
  Collections.forEach(collection => {
    const schema = collection.simpleSchema()._schema;
    // add "auto-relations" to schema resolvers
    Object.keys(schema).map(fieldName => {
      const field = schema[fieldName];
      // if no resolver or relation is provided, try to guess relation and add it to schema
      if (field.resolveAs) {
        const { resolver, relation, type } = field.resolveAs;
        if (isCollectionType(type) && !resolver && !relation) {
          field.resolveAs.relation = field.type === Array ? 'hasMany' : 'hasOne';
        }
      }
    });
  });
};

/*

Pass an existing collection to overwrite it instead of creating a new one

*/
export const createCollection = (options) => {
  const { typeName, collectionName = generateCollectionNameFromTypeName(typeName), dbCollectionName } = options;
  let { schema, apiSchema, dbSchema } = options;

  const existingCollectionIndex = Collections.findIndex(c => c.collectionName === collectionName);
  const existingCollection = existingCollectionIndex >= 0 ? Collections[existingCollectionIndex] : null;

  // initialize new Mongo collection or get existing collection when overwriting
  const collection =
    existingCollection ||
    (collectionName === 'Users' && Meteor.users
      ? Meteor.users
      : new Mongo.Collection(dbCollectionName ? dbCollectionName : collectionName.toLowerCase()));

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

  //register individual collection callback
  registerCollectionCallback(typeName.toLowerCase());

  // if schema has at least one intl field, add intl callback just before
  // `${collectionName}.collection` callbacks run to make sure it always runs last
  if (schemaHasIntlFields(schema)) {
    hasIntlFields = true; // we have at least one intl field
    addCallback(`${typeName.toLowerCase()}.collection`, addIntlFields);
  }

  //run schema callbacks and run general callbacks last
  schema = runCallbacks({
    name: `${typeName.toLowerCase()}.collection`,
    iterator: schema,
    properties: { options },
  });
  schema = runCallbacks({ name: '*.collection', iterator: schema, properties: { options } });

  if (schema) {
    // attach schema to collection
    collection.attachSchema(createSchema(schema, apiSchema, dbSchema));
  }

  runCallbacksAsync({ name: '*.collection.async', properties: { options } });
  runCallbacksAsync({ name: `${collectionName}.collection.async`, properties: { options } });

  // ------------------------------------- Default Fragment -------------------------------- //

  const defaultFragment = getDefaultFragmentText(collection);
  if (defaultFragment) registerFragment(defaultFragment);

  // ------------------------------------- Parameters -------------------------------- //

  // legacy
  collection.getParameters = (terms = {}, apolloClient, context) => {
    // console.log(terms);

    const currentSchema = collection.simpleSchema()._schema;

    let parameters = {
      selector: {},
      options: {},
    };

    if (collection.defaultView) {
      parameters = Utils.deepExtend(true, parameters, collection.defaultView(terms, apolloClient, context));
    }

    // handle view option
    if (terms.view && collection.views[terms.view]) {
      const viewFn = collection.views[terms.view];
      const view = viewFn(terms, apolloClient, context);
      let mergedParameters = Utils.deepExtend(true, parameters, view);

      if (mergedParameters.options && mergedParameters.options.sort && view.options && view.options.sort) {
        // If both the default view and the selected view have sort options,
        // don't merge them together; take the selected view's sort. (Otherwise
        // they merge in the wrong order, so that the default-view's sort takes
        // precedence over the selected view's sort.)
        mergedParameters.options.sort = view.options.sort;
      }
      parameters = mergedParameters;
    }

    // iterate over posts.parameters callbacks
    parameters = runCallbacks(`${typeName.toLowerCase()}.parameters`, parameters, clone(terms), apolloClient, context);
    // OpenCRUD backwards compatibility
    parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters`, parameters, clone(terms), apolloClient, context);

    if (Meteor.isClient) {
      parameters = runCallbacks(`${typeName.toLowerCase()}.parameters.client`, parameters, clone(terms), apolloClient);
      // OpenCRUD backwards compatibility
      parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters.client`, parameters, clone(terms), apolloClient);
    }

    // note: check that context exists to avoid calling this from withList during SSR
    if (Meteor.isServer && context) {
      parameters = runCallbacks(`${typeName.toLowerCase()}.parameters.server`, parameters, clone(terms), context);
      // OpenCRUD backwards compatibility
      parameters = runCallbacks(`${collectionName.toLowerCase()}.parameters.server`, parameters, clone(terms), context);
    }

    // sort using terms.orderBy (overwrite defaultView's sort)
    if (terms.orderBy && !isEmpty(terms.orderBy)) {
      parameters.options.sort = terms.orderBy;
    }

    // if there is no sort, default to sorting by createdAt descending
    if (!parameters.options.sort) {
      parameters.options.sort = { createdAt: -1 };
    }

    // extend sort to sort posts by _id to break ties, unless there's already an id sort
    // NOTE: always do this last to avoid overriding another sort
    //if (!(parameters.options.sort && parameters.options.sort._id)) {
    //  parameters = Utils.deepExtend(true, parameters, { options: { sort: { _id: -1 } } });
    //}

    // remove any null fields (setting a field to null means it should be deleted)
    Object.keys(parameters.selector).forEach(key => {
      if (parameters.selector[key] === null) delete parameters.selector[key];
    });
    if (parameters.options.sort) {
      Object.keys(parameters.options.sort).forEach(key => {
        if (parameters.options.sort[key] === null) delete parameters.options.sort[key];
      });
    }

    if (terms.query) {
      const query = escapeStringRegexp(terms.query);
      const searchableFieldNames = Object.keys(currentSchema).filter(fieldName => currentSchema[fieldName].searchable);
      if (searchableFieldNames.length) {
        parameters = Utils.deepExtend(true, parameters, {
          selector: {
            $or: searchableFieldNames.map(fieldName => ({
              [fieldName]: { $regex: query, $options: 'i' },
            })),
          },
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

    // console.log(JSON.stringify(parameters, 2));

    return parameters;
  };

  if (existingCollection) {
    Collections[existingCollectionIndex] = existingCollection;
  } else {
    Collections.push(collection);
  }

  return collection;
};

//register collection creation hook for each collection
function registerCollectionCallback(typeName) {
  registerCallback({
    name: `${typeName}.collection`,
    iterator: { schema: 'the schema of the collection' },
    properties: [
      { schema: 'The schema of the collection' },
      { validationErrors: 'An Object that can be used to accumulate validation errors' },
    ],
    runs: 'sync',
    returns: 'schema',
    description: 'Modifies schemas on collection creation',
  });
}

//register colleciton creation hook
registerCallback({
  name: '*.collection',
  iterator: { schema: 'the schema of the collection' },
  properties: [
    { schema: 'The schema of the collection' },
    { validationErrors: 'An object that can be used to accumulate validation errors' },
  ],
  runs: 'sync',
  returns: 'schema',
  description: 'Modifies schemas on collection creation',
});

// generate foo_intl fields
export function addIntlFields(schema) {
  Object.keys(schema).forEach(fieldName => {
    const fieldSchema = schema[fieldName];
    if (isIntlField(fieldSchema) && !schemaHasIntlField(schema, fieldName)) {

      // remove `intl` to avoid treating new _intl field as a field to internationalize
      // eslint-disable-next-line no-unused-vars
      const { intl, ...propertiesToCopy } = schema[fieldName];

      schema[`${fieldName}_intl`] = {
        ...propertiesToCopy, // copy properties from regular field
        hidden: true,
        type: Array,
        isIntlData: true,
      };

      delete schema[`${fieldName}_intl`].intl;

      schema[`${fieldName}_intl.$`] = {
        type: getIntlString(),
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
  return schema;
}
