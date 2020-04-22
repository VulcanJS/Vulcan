import Users from '../lib/modules/collection';
import '../lib/modules/permissions';
const test = it;
import expect from 'expect';
import { createDummyCollection } from 'meteor/vulcan:test';
import SimpleSchema from 'simpl-schema';

describe('vulcan:users/permissions', () => {
  const Dummies = createDummyCollection({
    schema: {
      guestField: {
        type: String,
        canRead: ['guests'],
      },
      adminField: {
        type: String,
        canRead: ['admins'],
      },
      ownerField: {
        type: String,
        canRead: ['owners'], // => need a document to be passed in order to check if the field is readable/filterable
      },
      customField: {
        type: String,
        canRead: [document => document && document.canRead], // => need a document to be passed in order to check if the field is readable/filterable
      },
    },
  });
  test('getViewableFields as projection (legacy)', () => {
    const fields = Users.getViewableFields(null, Dummies);
    expect(fields).toEqual({
      guestField: true,
    });
  });
  test('getReadableFields', () => {
    const fields = Users.getReadableFields(null, Dummies);
    expect(fields).toEqual(['guestField']);
  });
  test('getReadableFields with document-based permissions excludes ambiguous fields', () => {
    const fields = Users.getReadableFields(null, Dummies);
    expect(fields).not.toContain('ownerField');
    expect(fields).not.toContain('customField');
  });
  test('getReadableProjection', () => {
    const fields = Users.getReadableProjection(null, Dummies);
    expect(fields).toEqual({ guestField: true });
  });

  describe('fields allowed for filtering', () => {
    test('get fields that needs to be checked against the document to be tested', () => {
      const documentBasedPermissionFields = Users.getDocumentBasedPermissionFieldNames(Dummies);
      expect(documentBasedPermissionFields).toContain('ownerField');
      expect(documentBasedPermissionFields).toContain('customField');
    });
    test('checkFields throw on wrong permission', () => {
      expect(() => Users.checkFields(null, Dummies, ['adminField'])).toThrow();
      expect(Users.checkFields(null, Dummies, ['guestField'])).toBe(true);
    });
    test('checkFields with document-based permissions do not throw for ambigous fields (those field need the document to be checked)', () => {
      const res = Users.checkFields(null, Dummies, ['guestField', 'ownerField', 'customField']);
      expect(res).toEqual(true);
    });
  });

  test('restrictViewableFields', () => {
    const fields = Users.restrictViewableFields(null, Dummies, { adminField: 'foo', guestField: 'bar' });
    expect(fields).toEqual({ guestField: 'bar' });
  });

  describe('nested fields', () => {
    test('remove unreadable field of nested object', () => {
      const Dummies = createDummyCollection({
        schema: {
          nested: {
            canRead: ['guests'],
            type: new SimpleSchema({
              ok: {
                type: String,
                canRead: ['guests'],
              },
              nok: {
                type: String,
                canRead: ['members'],
              },
            }),
          },
        },
      });
      const fields = Users.restrictViewableFields(null, Dummies, { nested: { ok: 'foo', nok: 'bar' } });
      expect(fields).toEqual({ nested: { ok: 'foo' } });
    });
    test('remove unreadable field of array of nested objects', () => {
      const Dummies = createDummyCollection({
        schema: {
          array: {
            type: Array,
            canRead: ['guests'],
          },
          'array.$': {
            canRead: ['guests'],
            type: new SimpleSchema({
              ok: {
                type: String,
                canRead: ['guests'],
              },
              nok: {
                type: String,
                canRead: ['members'],
              },
            }),
          },
        },
      });
      const fields = Users.restrictViewableFields(null, Dummies, { array: [{ ok: 'foo', nok: 'bar' }] });
      expect(fields).toEqual({ array: [{ ok: 'foo' }] });
    });
    test('ignore fields without read permission (parent permissions are used)', () => {
      const Dummies = createDummyCollection({
        schema: {
          nested: {
            canRead: ['guests'],
            type: new SimpleSchema({
              ok: {
                type: String,
              },
              nok: {
                type: String,
                canRead: ['members'],
              },
            }),
          },
        },
      });
      const fields = Users.restrictViewableFields(null, Dummies, { nested: { ok: 'foo', nok: 'bar' } });
      expect(fields).toEqual({ nested: { ok: 'foo' } });
    });
  });
});
