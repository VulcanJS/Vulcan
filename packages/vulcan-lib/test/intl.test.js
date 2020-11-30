import React from 'react';
import expect from 'expect';
import {addStrings, Strings, Utils} from 'meteor/vulcan:core';
import {formatLabel, getString} from '../lib/modules/intl';
import { shallow } from 'enzyme';

// constants for formatLabel
const fieldName = 'testFieldName';
const fieldNameForSchema = 'fieldNameForSchema';
const fieldNameForGlobal = 'testFieldNameGlobal';
const fieldNameForCollection = 'testFieldNameCollection';
const unknownFieldName = 'unknownFieldName';
const collectionName = 'Tests';
const labelFromCollection = 'label from collection';
const labelFromGlobal = 'label from global';
const labelFromSchema = 'label from schema';
const labelFromFieldName = 'label from fieldName';

// add the schema entries for all fields to test respect of the order too
const schema = {
  [fieldName]: {
    label: labelFromSchema,
  },
  [fieldNameForSchema]: {
    label: labelFromSchema,
  },
  [fieldNameForGlobal]: {
    label: labelFromSchema,
  },
  [fieldNameForCollection]: {
    label: labelFromSchema,
  },
};

// add the strings for formatLabel
addStrings('en', {
  // fieldName only
  [fieldName]: labelFromFieldName,
  // fieldName + global - we expect labelFromGlobal
  [fieldNameForGlobal]: labelFromFieldName,
  [`global.${fieldNameForGlobal}`]: labelFromGlobal,
  // fieldName + global + collectionName - we expect labelFromCollection
  [fieldNameForCollection]: labelFromFieldName,
  [`global.${fieldNameForCollection}`]: labelFromGlobal,
  [`${collectionName.toLowerCase()}.${fieldNameForCollection}`]: labelFromCollection,
});

const intl = {
  formatMessage: ({id, defaultMessage}, values = null) => {
    return getString({id, defaultMessage, values, messages: Strings, locale: 'en'});
  }
}

describe('vulcan:lib/intl', function () {

  describe('formatLabel', function () {

    it('return the fieldName when there is no matching string or label', function () {
      const ENString = formatLabel({fieldName: unknownFieldName, schema, collectionName, intl});
      expect(ENString).toEqual(Utils.camelToSpaces(unknownFieldName));
    });

    it('return the matching schema label when there is no matching string', function () {
      const ENString = formatLabel({fieldName: fieldNameForSchema, schema, collectionName, intl});
      expect(ENString).toEqual(schema[fieldName].label);
    });

    it('return the label from a matched `fieldName`', function () {
      const ENString = formatLabel({fieldName, schema, collectionName, intl});
      expect(ENString).toEqual(labelFromFieldName);
    });

    it('return the label from a matched `global.fieldName`', function () {
      const ENString = formatLabel({fieldName: fieldNameForGlobal, schema, collectionName, intl});
      expect(ENString).toEqual(labelFromGlobal);
    });

    it('return the label from a matched `collectionName.fieldName`', function () {
      const ENString = formatLabel({fieldName: fieldNameForCollection, schema, collectionName, intl});
      expect(ENString).toEqual(labelFromCollection);
    });

  });

  describe('getString', function () {

    it('returns a simple string', function () {
      const id = 'simple';
      const string = 'This is an intl string with no values';
      const expected = string;
      addStrings('en', {[id]: string});

      const ENString = getString({id, messages: Strings, locale: 'en'});
      expect(ENString).toEqual(expected);
    });

    it('substitutes string values passed', function () {
      const id = 'withStringValue';
      const string = 'This is an intl string with {type} values';
      const values = {
        type: 'string'
      };
      const expected = 'This is an intl string with string values';
      addStrings('en', {[id]: string});

      const ENString = getString({id, values, messages: Strings, locale: 'en'});
      expect(ENString).toEqual(expected);
    });

    it('substitutes plural values passed', function () {
      const id = 'withPluralValue';
      const string = 'You have {itemCount, plural, =0 {no items} one {# item} other {# items}}.';
      const expectedWithZero = 'You have no items.';
      const expectedWithOne = 'You have 1 item.';
      const expectedWithOther = 'You have 3 items.';
      addStrings('en', {[id]: string});

      const ENString1 = getString({id, values: { itemCount: 0 }, messages: Strings, locale: 'en'});
      expect(ENString1).toEqual(expectedWithZero);

      const ENString2 = getString({id, values: { itemCount: 1 }, messages: Strings, locale: 'en'});
      expect(ENString2).toEqual(expectedWithOne);

      const ENString3 = getString({id, values: { itemCount: 3 }, messages: Strings, locale: 'en'});
      expect(ENString3).toEqual(expectedWithOther);
    });

    it('substitutes react node values passed', function () {
      const id = 'withNodeValue';
      const string = 'To learn more, see {link}';
      const values = {
        link: <a href="https://docs.vulcanjs.org/unit-testing.html" className="link">Vulcan Docs</a>,
      };
      const expected = ['To learn more, see ', values.link];
      addStrings('en', {[id]: string});

      const ENResult = getString({id, values, messages: Strings, locale: 'en'});
      expect(Array.isArray(ENResult)).toBeTruthy();
      expect(ENResult).toHaveLength(2);
      expect(ENResult[0]).toEqual(expected[0]);

      const wrapper = shallow(<span>{ENResult}</span>);
      expect(wrapper.find('.link')).toHaveLength(1);
    });

  });

});
