import React from 'react';
// TODO: should be loaded from Components instead?
import Form from '../lib/components/Form';
import FormComponent from '../lib/components/FormComponent';
import FormNestedArray from '../lib/components/FormNestedArray';
import FormNestedArrayLayout from '../lib/components/FormNestedArrayLayout';
import expect from 'expect';

import { mount, shallow } from 'enzyme';
import { Components } from 'meteor/vulcan:core';
import { initComponentTest } from 'meteor/vulcan:test';

// we must import all the other components, so that "registerComponent" is called
import '../lib/modules/components';


// setup Vulcan (load components, initialize fragments)
initComponentTest();

// helpers
// tests
describe('vulcan-forms/FormNestedObject', function () {
    const defaultProps = {
        errors: [],
        path: 'foobar',
        formComponents: Components,
    };
    it('shallow render', function () {
        const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
        expect(wrapper).toBeDefined();
    });
    it.skip('render a Form collectionName="" for the object', function () {
        // eslint-disable-next-line no-unused-vars
        const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
        expect(false).toBe(true);
    });
    it('does not show any button', function () {
        const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
        const button = wrapper.find('BootstrapButton');
        expect(button).toHaveLength(0);
    });
    it('does not show add button', function () {
        const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
        const addButton = wrapper.find('IconAdd');
        expect(addButton).toHaveLength(0);
    });
    it('does not show remove button', function () {
        const wrapper = shallow(<Components.FormNestedObject {...defaultProps} currentValues={{}} />);
        const removeButton = wrapper.find('IconRemove');
        expect(removeButton).toHaveLength(0);
    });
});
