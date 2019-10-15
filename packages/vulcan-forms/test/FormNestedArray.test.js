
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



// helpers
// tests
describe('vulcan:forms/FormNestedArray', function () {
    const defaultProps = {
        errors: [],
        deletedValues: [],
        path: 'foobar',
        formComponents: Components,
        //nestedFields: []
    };

    describe('Display the input n times', function () {
        it('shallow render', function () {
            const wrapper = shallow(<FormNestedArray {...defaultProps} currentValues={{}} />);
            expect(wrapper).toBeDefined();
        });
        // TODO: broken now we use a layout...
        it.skip('shows an add button when empty', function () {
            const wrapper = mount(<FormNestedArray {...defaultProps} currentValues={{}} />);
            const addButton = wrapper.find('IconAdd');
            expect(addButton).toHaveLength(1);
        });
        it.skip('shows 3 items', function () {
            const wrapper = mount(
                <FormNestedArray {...defaultProps} currentValues={{}} value={[1, 2, 3]} />
            );
            const nestedItem = wrapper.find('FormNestedItem');
            expect(nestedItem).toHaveLength(3);
        });
        it.skip('pass the correct path and itemIndex to each form', function () {
            const wrapper = mount(
                <FormNestedArray {...defaultProps} currentValues={{}} value={[1, 2]} />
            );
            const nestedItem = wrapper.find('FormNestedItem');
            const item0 = nestedItem.at(0);
            const item1 = nestedItem.at(1);
            expect(item0.prop('itemIndex')).toEqual(0);
            expect(item1.prop('itemIndex')).toEqual(1);
            expect(item0.prop('path')).toEqual('foobar.0');
            expect(item1.prop('path')).toEqual('foobar.1');
        });
    });
    describe('maxCount', function () {
        const props = {
            ...defaultProps,
            maxCount: 2,
        };
        it('should pass addItem to FormNestedArrayLayout if items < maxCount', function () {
            const wrapper = shallow(<FormNestedArray {...props} maxCount={2} currentValues={{}} value={[1]} />);
            const layout = wrapper.find('FormNestedArrayLayout').first();
            const addItem = layout.props().addItem;
            expect(typeof addItem).toBe('function');
        });
        it('should display add button if items < maxCount', function () {
            const wrapper = shallow(<FormNestedArrayLayout {...defaultProps} addItem={() => { return null; }} hasError={false} />);
            const button = wrapper.find('.form-nested-button');
            expect(button).toHaveLength(1);
        });
        it('should not pass addItem to FormNestedArrayLayout if items >= maxCount', function () {
            const wrapper = shallow(<FormNestedArray {...props} maxCount={2} currentValues={{}} value={[1, 2]} />);
            const layout = wrapper.find('FormNestedArrayLayout').first();
            const addItem = layout.props().addItem;
            expect(addItem).toBeNull();
        });
        it('should not display add button if items >= maxCount', function () {
            const wrapper = shallow(<FormNestedArrayLayout {...defaultProps} addItem={null} hasError={false} />);
            const button = wrapper.find('.form-nested-button');
            expect(button).toHaveLength(0);
        });
    });

    describe('minCount', function () {
        const props = {
            ...defaultProps,
            minCount: 2,
        };
        it('should display remove item button when array length > minCount', function () {
            const wrapper = shallow(<FormNestedArray {...props} currentValues={{}} value={[1, 2, 3]} />);
            const layout = wrapper.find('FormNestedArrayLayout').first();
            const nestedItems = layout.find('FormNestedItem');
            nestedItems.forEach((nestedItem, idx) => {
                const hideRemove = nestedItem.prop('hideRemove');
                expect({ res: hideRemove, idx }).toEqual({ res: false, idx });
            });
        });
        it('should not display remove button if items <= minCount', function () {
            const wrapper = shallow(<FormNestedArray {...props} currentValues={{}} value={[1, 2]} />);
            const layout = wrapper.find('FormNestedArrayLayout').first();
            const nestedItems = layout.find('FormNestedItem');
            nestedItems.forEach((nestedItem, idx) => {
                const hideRemove = nestedItem.prop('hideRemove');
                expect({ res: hideRemove, idx }).toEqual({ res: true, idx });
            });
        });
    });
});
