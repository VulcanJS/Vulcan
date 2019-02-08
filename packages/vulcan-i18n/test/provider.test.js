import IntlProvider from '../lib/modules/provider';
import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { addStrings, Utils } from 'meteor/vulcan:core';

// constants for formatMessage
const defaultMessage = 'default';
const stringId = 'test_string';
const ENTestString = 'English test string';
const FRTestString = 'Phrase test en Français';
const valueStringId = 'valueStringId';
const valueStringValue = 'Vulcan';
const valueTestStringStatic = 'the value is ';
const valueTestStringDynamic = 'testValue';
const valueTestString = `${valueTestStringStatic}{${valueTestStringDynamic}}`;

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
// add the strings for formatMessage
addStrings('en', {
  [stringId]: ENTestString,
  [valueStringId]: valueTestString,
});
addStrings('fr', {
  [stringId]: FRTestString,
});

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

describe('vulcan:i18n/IntlProvider', function() {
  it('shallow render', function() {
    const wrapper = shallow(<IntlProvider />);
    expect(wrapper).toBeDefined();
  });
  describe('formatMessage', function() {
    it('format a message according to locale', function() {
      const wrapper = shallow(<IntlProvider locale="en" />);
      const ENString = wrapper.instance().formatMessage({ id: stringId });
      expect(ENString).toEqual(ENTestString);
      wrapper.setProps({ locale: 'fr' });
      const FRString = wrapper.instance().formatMessage({ id: stringId });
      expect(FRString).toEqual(FRTestString);
    });
    it('format a message according to a value', function() {
      const wrapper = shallow(<IntlProvider locale="en" />);
      const dynamicString = wrapper
        .instance()
        .formatMessage({ id: valueStringId }, { [valueTestStringDynamic]: valueStringValue });
      expect(dynamicString).toEqual(valueTestStringStatic + valueStringValue);
    });
    it('return a default message when no string is found', function() {
      const wrapper = shallow(<IntlProvider locale="en" />);
      const ENString = wrapper.instance().formatMessage({
        id: 'unknownStringId',
        defaultMessage: defaultMessage,
      });
      expect(ENString).toEqual(defaultMessage);
    });
  });
  describe('formatLabel', function() {
    const wrapper = shallow(<IntlProvider locale="en" />);
    it('return the fieldName when there is no matching string or label', function() {
      const ENString = wrapper
        .instance()
        .formatLabel({ fieldName: unknownFieldName, schema, collectionName });
      expect(ENString).toEqual(Utils.camelToSpaces(unknownFieldName));
    });
    it('return the matching schema label when there is no matching string', function() {
      const ENString = wrapper
        .instance()
        .formatLabel({ fieldName: fieldNameForSchema, schema, collectionName });
      expect(ENString).toEqual(schema[fieldName].label);
    });
    it('return the label from a matched `fieldName`', function() {
      const ENString = wrapper.instance().formatLabel({ fieldName, schema, collectionName });
      expect(ENString).toEqual(labelFromFieldName);
    });
    it('return the label from a matched `global.fieldName`', function() {
      const ENString = wrapper
        .instance()
        .formatLabel({ fieldName: fieldNameForGlobal, schema, collectionName });
      expect(ENString).toEqual(labelFromGlobal);
    });
    it('return the label from a matched `collectionName.fieldName`', function() {
      const ENString = wrapper
        .instance()
        .formatLabel({ fieldName: fieldNameForCollection, schema, collectionName });
      expect(ENString).toEqual(labelFromCollection);
    });
  });
});
