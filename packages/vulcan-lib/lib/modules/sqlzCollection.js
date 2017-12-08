import SimpleSchema from 'simpl-schema';
//import Sequelize from 'sequelize';

const LG = (msg) => console.log('Within %s...\n  |%s', module.id, msg);
const MRK = () => console.log('.....................');

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
    console.log('\n\n--- Vulcan modules/sqlzCollection ---');
    console.log('            FIXME constructor()');
    console.log(' ormCollection ', ormCollection );

    self._name = name;
    self._collection = ormCollection;

    // console.log(' Name ', self._name);
    // console.log(' Collection ', self._collection);
    // console.log('-----------------||--------------------');

    // self.asynchFindOne = ( key ) => {
    //   return self._collection.findAndCountAll( key );
    // }

    // self.parmsFindOne = null;
    // function* genFindOne() {
    //   console.log(` gen next parms ::::::: %s`, self.parmsFindOne );
    //   yield self.asynchFindOne( self.parmsFindOne );
    // }

    // self.generatorFindOne = genFindOne;

    return Object.assign( {}, self, );

  }
}

Sqlz.Cursor = class Cursor extends Array {
  constructor(x) {
    super(x);
  }

  // fetch() { return this[0].map( ii => ii.dataValues )  }

  fetch() { return this[0].map( ii => ii.dataValues ); }

}

Sqlz.Collection.prototype.find = ( key ) => {

  const rslt = Promise.await(
    self._resultSet = self._collection.findAndCountAll(  key ? key : {}  )
  );

  self._cursor = new Sqlz.Cursor(rslt.rows);

  return self._cursor;
}


Sqlz.Collection.prototype.findOne = ( _key ) => {
  // console.log('--- Vulcan modules/sqlzCollection --- findOne()');
  // console.log(_key);

  const rslt = Promise.await(
    self._collection.findOne( { where: _key } )
  );

  // console.log(rslt.dataValues.name);
  // console.log('----------------------------------->>\n');
  return rslt;

}

// const sqlz = new Sqlz.Collection("piggy");

// console.log ('  Sqlz.Collection.prototype ', Sqlz.Collection.prototype);
// console.log ('  ****************************************************** ' );

// console.log ('  sqlz.prototype ', sqlz);
// console.log ('  ****************************************************** ' );


Sqlz.Collection.prototype.count = () => {
  console.log('--- Vulcan modules/sqlzCollection ---');
  console.log('            FIXME count()');
  console.log('-------------------------------------');
}

Sqlz.Collection.prototype.insert = ( spec ) => {
  // console.log('--- Vulcan modules/sqlzCollection ---');
  // console.log('            FIXME insert()', spec);
  // console.log('-------------------------------------');

  const rslt = Promise.await(
    self._collection.create( spec )
  );

  // console.log(rslt.dataValues._id);
  // console.log('----------------------------------->>\n');
  return rslt.dataValues._id;



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

export default Sqlz;
