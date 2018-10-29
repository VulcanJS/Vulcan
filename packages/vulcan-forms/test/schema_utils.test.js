import {
  getNestedFieldSchemaOrType,
  getValidFields,
  getCreateableFields,
  getReadableFields,
  getUpdateableFields
} from '../lib/modules/schema_utils.js';
import SimpleSchema from 'simpl-schema';
import expect from 'expect';

const addressSchema = {
  street: {
    type: String
  },
  country: {
    type: String
  }
};
const addressSimpleSchema = new SimpleSchema(addressSchema);

describe('schema_utils', function() {
  describe('getNestedFieldSchemaOrType', function() {
    it('get nested schema of an array', function() {
      const simpleSchema = new SimpleSchema({
        addresses: {
          type: Array
        },
        'addresses.$': {
          // this is due to SimpleSchema objects structure
          type: addressSimpleSchema
        }
      });
      const nestedSchema = getNestedFieldSchemaOrType('addresses', simpleSchema);
      // nestedSchema is a complex SimpleSchema object, so we can only
      // test its type instead (might not be the simplest way though)
      expect(Object.keys(nestedSchema._schema)).toEqual(Object.keys(addressSchema));
    });
    it('get nested schema of an object', function() {
      const simpleSchema = new SimpleSchema({
        meetingPlace: {
          type: addressSimpleSchema
        }
      });
      const nestedSchema = getNestedFieldSchemaOrType('meetingPlace', simpleSchema);
      expect(Object.keys(nestedSchema._schema)).toEqual(Object.keys(addressSchema));
    });
    it('return null for other types', function() {
      const simpleSchema = new SimpleSchema({
        createdAt: {
          type: Date
        }
      });
      const nestedSchema = getNestedFieldSchemaOrType('createdAt', simpleSchema);
      expect(nestedSchema).toBeNull();
    });
  });
  describe('fields extraction', function() {
    describe('valid', function() {
      it('remove invalid fields', function() {
        const schema = {
          validField: {},
          arrayField: {},
          // array child
          'arrayField.$': {}
        };
        expect(getValidFields(schema)).toEqual(['validField', 'arrayField']);
      });
    });
    describe('readable', function() {
      it('get readable field', function() {
        const schema = {
          readable: { canRead: [] },
          notReadble: {}
        };
        expect(getReadableFields(schema)).toEqual(['readable']);
      });
    });
    describe('creatable', function() {
      it('get creatable field', function() {
        const schema = {
          creatable: { canCreate: [] },
          notCreatable: {}
        };
        expect(getCreateableFields(schema)).toEqual(['creatable']);
      });
    });
    describe('updatable', function() {
      it('get updatable field', function() {
        const schema = {
          updatable: { canUpdate: [] },
          notUpdatable: {}
        };
        expect(getUpdateableFields(schema)).toEqual(['updatable']);
      });
    });
  });
});
