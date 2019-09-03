import IntlProvider from '../lib/modules/provider';
import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { addStrings } from 'meteor/vulcan:core';
import { initComponentTest } from 'meteor/vulcan:test';

initComponentTest();

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

// add the strings for formatMessage
addStrings('en', {
  [stringId]: ENTestString,
  [valueStringId]: valueTestString,
});
addStrings('fr', {
  [stringId]: FRTestString,
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
});
