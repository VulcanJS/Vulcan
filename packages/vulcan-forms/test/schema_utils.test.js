import {
  getNestedFieldSchemaOrType,
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

describe('schema_utils', function () {
  describe('getNestedFieldSchemaOrType', function () {
    it('get nested schema of an array', function () {
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
    it('get nested schema of an object', function () {
      const simpleSchema = new SimpleSchema({
        meetingPlace: {
          type: addressSimpleSchema
        }
      });
      const nestedSchema = getNestedFieldSchemaOrType('meetingPlace', simpleSchema);
      expect(Object.keys(nestedSchema._schema)).toEqual(Object.keys(addressSchema));
    });
    it('return null for other types', function () {
      const simpleSchema = new SimpleSchema({
        createdAt: {
          type: Date
        }
      });
      const nestedSchema = getNestedFieldSchemaOrType('createdAt', simpleSchema);
      expect(nestedSchema).toBeNull();
    });
  });
});
