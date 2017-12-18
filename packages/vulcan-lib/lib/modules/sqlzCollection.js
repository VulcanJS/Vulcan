import SimpleSchema from 'simpl-schema';
import moment from 'moment';

const LG = (ln, msg) => console.log('Within %s @ %s ...\n  | %s', module.id, ln, msg);
const MRK = (chr, cnt) => console.log(chr.repeat(cnt));

var self = {};
const Sqlz = {};

Sqlz.Collection = class Collection {
  constructor(name, ormCollection) {
    if (! (this instanceof Sqlz.Collection))
      throw new Error('use "new" to construct a Sqlz.Collection');

    if (!name && (name !== null)) {
      console.log("Warning: creating anonymous collection. It will not be " +
                    "saved or synchronized over the network. (Pass null for " +
                    "the collection name to turn off this warning.)");
      name = null;
    }

    if (name !== null && typeof name !== "string") {
      throw new Error(
        "First argument to new Sqlz.Collection must be a string or null");
    }

    self = Sqlz.Collection.prototype;

    self._name = name;
    self._collection = ormCollection;

    let attrs = ormCollection.prototype.rawAttributes;
    self._dateFields = Object.keys(attrs).filter( elm => {
      return attrs[elm].type.toString() === `DATETIME`
    });

    return Object.assign( {}, self, );

  }
}

const fixDates = element => {
  self._dateFields.forEach( ky => {
    element[ky] = new Date(element[ky]);
  })
  return element;
}

Sqlz.Cursor = class Cursor extends Array {
  constructor(x) {
    super(x);
  }

  fetch() {
    let rslt = this[0].map( ii => {
      return fixDates(ii.dataValues);
    });
    return rslt;
  }

  count() {
    return this[0].length;
  }

}

Sqlz.Collection.prototype.find = ( _selector ) => {

  let key = _selector ? _selector : {};
  const rslt = Promise.await(
    self._resultSet = self._collection.findAndCountAll( key )
  );

  self._cursor = new Sqlz.Cursor(rslt.rows);
  return self._cursor;
}


Sqlz.Collection.prototype.findOne = ( _selector ) => {

  let key = ( typeof _selector === `string` ) ? { _id: _selector } : _selector;
  let options = { where: key };

  if( Object.keys(key).find( i => i === 'deletedAt') ) {
    if( ! moment( key.deletedAt, moment.ISO_8601).isValid() ) {
      throw new Error(`Invalid date format. Date '${key.deletedAt}' must be formatted as ISO8601`);
    }
    options.paranoid = false;
  };

  const rslt = Promise.await(
    self._collection.findOne( options )
  );

  return rslt;

}


Sqlz.Collection.prototype.count = () => {
  console.log('--- Vulcan modules/sqlzCollection ---');
  console.log('            FIXME count()');
  console.log('-------  not implemented  -----------');
}

Sqlz.Collection.prototype.insert = ( spec ) => {
  const rslt = Promise.await(
    self._collection.create( spec )
  );

  return rslt.dataValues._id;
}

Sqlz.Collection.prototype.update = ( _selector, _newValues ) => {
  let selector = ( typeof _selector === `string` ) ? { _id: _selector } : _selector;
  const rslt = Promise.await(
    self._collection.update( _newValues['$set'], { where: selector } )
  );

  console.log( `got back '_id' array : `, rslt );
  return rslt;
}

Sqlz.Collection.prototype.remove = ( _selector ) => {

  let selector = { _id: _selector };
  const rslt = Promise.await(
    self._collection.destroy( { where: selector } )
  );

  console.log( `got back '_id' array : `, rslt );
  return _selector;

}

/**
 * @summary replacement for Collection2's attachSchema. Pass either a schema, to
 * initialize or replace the schema, or some fields, to extend the current schema
 * @class Sqlz.Collection
 */
Sqlz.Collection.prototype.attachSchema = function (schemaOrFields) {
  if (schemaOrFields instanceof SimpleSchema) {
    this.simpleSchema = () => schemaOrFields;
  } else {
    this.simpleSchema().extend(schemaOrFields)
  }
}


/* ****** NOTHING_BELOW_THIS_LINE_HAS_BEEN_TESTED_YET ****** */
let NOTHING_BELOW_THIS_LINE_HAS_BEEN_TESTED_YET;
if ( NOTHING_BELOW_THIS_LINE_HAS_BEEN_TESTED_YET ) {

/**
 * @summary Add an additional field (or an array of fields) to a schema.
 * @param {Object|Object[]} field
 */
Sqlz.Collection.prototype.addField = function (fieldOrFieldArray) {

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
Sqlz.Collection.prototype.removeField = function (fieldName) {

  var collection = this;
  var schema = _.omit(collection.simpleSchema()._schema, fieldName);

  // add field schema to collection schema
  collection.attachSchema(new SimpleSchema(schema));
};

/**
 * @summary Add a default view function.
 * @param {Function} view
 */
Sqlz.Collection.prototype.addDefaultView = function (view) {
  this.defaultView = view;
};

/**
 * @summary Add a named view function.
 * @param {String} viewName
 * @param {Function} view
 */
Sqlz.Collection.prototype.addView = function (viewName, view) {
  this.views[viewName] = view;
};

// see https://github.com/dburles/meteor-collection-helpers/blob/master/collection-helpers.js
Sqlz.Collection.prototype.helpers = function(helpers) {
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
}
/* ****** NOTHING_ABOVE_THIS_LINE_HAS_BEEN_TESTED_YET ****** */

export default Sqlz;
