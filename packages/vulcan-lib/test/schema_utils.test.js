import {
  getCreateableFields,
  getReadableFields,
  getUpdateableFields,
  getValidFields,
} from '../lib/modules/schema_utils.js';
import expect from 'expect';

describe('schema_utils', function () {
  describe('fields extraction', function () {
    describe('valid', function () {
      it('remove invalid fields', function () {
        const schema = {
          validField: {},
          arrayField: {},
          // array child
          'arrayField.$': {}
        };
        expect(getValidFields(schema)).toEqual(['validField', 'arrayField']);
      });
    });
    describe('readable', function () {
      it('get readable field', function () {
        const schema = {
          readable: { canRead: [] },
          notReadble: {}
        };
        expect(getReadableFields(schema)).toEqual(['readable']);
      });
    });
    describe('creatable', function () {
      it('get creatable field', function () {
        const schema = {
          creatable: { canCreate: [] },
          notCreatable: {}
        };
        expect(getCreateableFields(schema)).toEqual(['creatable']);
      });
    });
    describe('updatable', function () {
      it('get updatable field', function () {
        const schema = {
          updatable: { canUpdate: [] },
          notUpdatable: {}
        };
        expect(getUpdateableFields(schema)).toEqual(['updatable']);
      });
    });
  });
});
