

import React from 'react';
// TODO: should be loaded from Components instead?
import FormComponent from '../lib/components/FormComponent';
import expect from 'expect';

import { mount, shallow } from 'enzyme';
import { Components } from 'meteor/vulcan:core';
import { initComponentTest } from 'meteor/vulcan:test';

// we must import all the other components, so that "registerComponent" is called
import '../lib/modules/components';

// setup Vulcan (load components, initialize fragments)
initComponentTest();

// fixtures
import SimpleSchema from 'simpl-schema';


// helpers
// tests
describe('vulcan-forms/FormComponent', function () {
    const shallowWithContext = C =>
        shallow(C, {
            context: {
                getDocument: () => { },
            },
        });
    const defaultProps = {
        disabled: false,
        optional: true,
        document: {},
        name: 'meetingPlace',
        path: 'meetingPlace',
        datatype: [{ type: Object }],
        layout: 'horizontal',
        label: 'Meeting place',
        currentValues: {},
        formType: 'new',
        deletedValues: [],
        throwError: () => { },
        updateCurrentValues: () => { },
        errors: [],
        clearFieldErrors: () => { },
    };
    it('shallow render', function () {
        const wrapper = shallowWithContext(<FormComponent {...defaultProps} />);
        expect(wrapper).toBeDefined();
    });
    describe('array of objects', function () {
        const props = {
            ...defaultProps,
            datatype: [{ type: Array }],
            nestedSchema: {
                street: {},
                country: {},
                zipCode: {},
            },
            nestedInput: true,
            nestedFields: [{}, {}, {}],
            currentValues: {},
        };
        it('render a FormNestedArray', function () {
            const wrapper = shallowWithContext(<FormComponent {...props} />);
            const formNested = wrapper.find('FormNestedArray');
            expect(formNested).toHaveLength(1);
        });
    });
    describe('nested object', function () {
        const props = {
            ...defaultProps,
            datatype: [{ type: new SimpleSchema({}) }],
            nestedSchema: {
                street: {},
                country: {},
                zipCode: {},
            },
            nestedInput: true,
            nestedFields: [{}, {}, {}],
            currentValues: {},
        };
        it('shallow render', function () {
            const wrapper = shallowWithContext(<FormComponent {...props} />);
            expect(wrapper).toBeDefined();
        });
        it('render a FormNestedObject', function () {
            const wrapper = shallowWithContext(<FormComponent {...props} />);
            const formNested = wrapper.find('FormNestedObject');
            expect(formNested).toHaveLength(1);
        });
    });
    describe('array of custom inputs (e.g url)', function () {
        it('shallow render', function () { });
    });

});
