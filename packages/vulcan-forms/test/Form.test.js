
import React from 'react';
// TODO: should be loaded from Components instead?
import Form from '../lib/components/Form';
import expect from 'expect';

import { mount, shallow } from 'enzyme';
import { initComponentTest } from 'meteor/vulcan:test';

// we must import all the other components, so that "registerComponent" is called
import '../lib/modules/components';

// TODO: init this component in Vulcan:core (currently depends on either Bootstrap or Material UI to exists)
import { registerComponent } from 'meteor/vulcan:core';
registerComponent({
    name: 'Button',
    component: ({ children, onClick, type, className }) => <button className={className} type={type} onClick={onClick}>{children}</button>
});
registerComponent({
    name: 'FormComponentInner',
    component: ({ children, onChange, onBlur, value, className }) => <input className={className} value={value} onBlur={onBlur} onChange={onChange} />
});

// setup Vulcan (load components, initialize fragments)
initComponentTest();

// fixtures
import SimpleSchema from 'simpl-schema';
const addressGroup = {
    name: 'addresses',
    label: 'Addresses',
    order: 10,
};
const permissions = {
    canRead: ['guests'],
    canUpdate: ['quests'],
    canCreate: ['guests'],
};

// just 1 input for state testing
const fooSchema = {
    foo: {
        type: String,
        ...permissions,
    },
};
//
const addressSchema = {
    street: {
        type: String,
        optional: true,
        ...permissions,
    },
};
// [{street, city,...}, {street, city, ...}]
const arrayOfObjectSchema = {
    addresses: {
        type: Array,
        group: addressGroup,
        ...permissions,
    },
    'addresses.$': {
        type: new SimpleSchema(addressSchema),
    },
};
// example with custom inputs for the children
// ["http://maps/XYZ", "http://maps/foobar"]
const arrayOfUrlSchema = {
    addresses: {
        type: Array,
        group: addressGroup,
        ...permissions,
    },
    'addresses.$': {
        type: String,
        input: 'url',
    },
};
// example with array and custom input
const CustomObjectInput = () => 'OBJECT INPUT';
const arrayOfCustomObjectSchema = {
    addresses: {
        type: Array,
        group: addressGroup,
        ...permissions,
    },
    'addresses.$': {
        type: new SimpleSchema(addressSchema),
        input: CustomObjectInput,
    },
};
// example with a fully custom input for both the array and its children
const ArrayInput = () => 'ARRAY INPUT';
const arrayFullCustomSchema = {
    addresses: {
        type: Array,
        group: addressGroup,
        ...permissions,
        input: ArrayInput,
    },
    'addresses.$': {
        type: String,
        input: 'url',
    },
};
// example with a native type
// ["20 rue du Moulin PARIS", "16 rue de la poste PARIS"]

// eslint-disable-next-line no-unused-vars
const arrayOfStringSchema = {
    addresses: {
        type: Array,
        group: addressGroup,
        ...permissions,
    },
    'addresses.$': {
        type: String,
    },
};
// object (not in an array): {street, city}
const objectSchema = {
    addresses: {
        type: new SimpleSchema(addressSchema),
        ...permissions,
    },
};
// without calling SimpleSchema
// eslint-disable-next-line no-unused-vars
const bareObjectSchema = {
    addresses: {
        type: addressSchema,
        ...permissions,
    },
};

// stub collection
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
const createDummyCollection = (typeName, schema) =>
    createCollection({
        collectionName: typeName + 's',
        typeName,
        schema,
        resolvers: getDefaultResolvers(typeName + 's'),
        mutations: getDefaultMutations(typeName + 's'),
    });
const Foos = createDummyCollection('Foo', fooSchema);
const ArrayOfObjects = createDummyCollection('ArrayOfObject', arrayOfObjectSchema);
const Objects = createDummyCollection('Object', objectSchema);
const ArrayOfUrls = createDummyCollection('ArrayOfUrl', arrayOfUrlSchema);
const ArrayOfCustomObjects = createDummyCollection(
    'ArrayOfCustomObject',
    arrayOfCustomObjectSchema
);
const ArrayFullCustom = createDummyCollection('ArrayFullCustom', arrayFullCustomSchema);
// eslint-disable-next-line no-unused-vars
const ArrayOfStrings = createDummyCollection('ArrayOfString', arrayOfStringSchema);

const Addresses = createCollection({
    collectionName: 'Addresses',
    typeName: 'Address',
    schema: addressSchema,
    resolvers: getDefaultResolvers('Addresses'),
    mutations: getDefaultMutations('Addresses'),
});

// helpers
// tests
describe('vulcan-forms/Form', function () {
    const context = {
        intl: {
            formatMessage: () => '',
            formatDate: () => '',
            formatTime: () => '',
            formatRelative: () => '',
            formatNumber: () => '',
            formatPlural: () => '',
            formatHTMLMessage: () => '',
            now: () => '',
        },
    };
    // eslint-disable-next-line no-unused-vars
    const mountWithContext = C =>
        mount(C, {
            context,
        });
    const shallowWithContext = C =>
        shallow(C, {
            context,
        });

    // since some props are now handled by HOC we need to provide them manually
    const defaultProps = {
        collectionName: '',
        typeName: '',
    };

    describe('Form generation', function () {
        // getters
        const getArrayFormGroup = wrapper => wrapper.find('FormGroup').find({ name: 'addresses' });
        const getFields = arrayFormGroup => arrayFormGroup.prop('fields');
        describe('basic collection - no nesting', function () {
            it('shallow render', function () {
                const wrapper = shallowWithContext(<Form {...defaultProps} collection={Addresses} />);
                expect(wrapper).toBeDefined();
            });
        });
        describe('nested object (not in array)', function () {
            it('shallow render', () => {
                const wrapper = shallowWithContext(<Form {...defaultProps} collection={Objects} />);
                expect(wrapper).toBeDefined();
            });
            it('define one field', () => {
                const wrapper = shallowWithContext(<Form {...defaultProps} collection={Objects} />);
                const defaultGroup = wrapper.find('FormGroup').first();
                const fields = defaultGroup.prop('fields');
                expect(fields).toHaveLength(1); // addresses field
            });

            const getFormFields = wrapper => {
                const defaultGroup = wrapper.find('FormGroup').first();
                const fields = defaultGroup.prop('fields');
                return fields;
            };
            const getFirstField = () => {
                const wrapper = shallowWithContext(<Form {...defaultProps} collection={Objects} />);
                const fields = getFormFields(wrapper);
                return fields[0];
            };
            it('define the nestedSchema', () => {
                const addressField = getFirstField();
                expect(addressField.nestedSchema.street).toBeDefined();
            });
        });
        describe('array of objects', function () {
            it('shallow render', () => {
                const wrapper = shallowWithContext(
                    <Form {...defaultProps} collection={ArrayOfObjects} />
                );
                expect(wrapper).toBeDefined();
            });
            it('render a FormGroup for addresses', function () {
                const wrapper = shallowWithContext(
                    <Form {...defaultProps} collection={ArrayOfObjects} />
                );
                const formGroup = wrapper.find('FormGroup').find({ name: 'addresses' });
                expect(formGroup).toBeDefined();
                expect(formGroup).toHaveLength(1);
            });
            it('passes down the array child fields', function () {
                const wrapper = shallowWithContext(
                    <Form {...defaultProps} collection={ArrayOfObjects} />
                );
                const formGroup = getArrayFormGroup(wrapper);
                const fields = getFields(formGroup);
                const arrayField = fields[0];
                expect(arrayField.nestedInput).toBe(true);
                expect(arrayField.nestedFields).toHaveLength(Object.keys(addressSchema).length);
            });
            it('uses prefilled props for the whole array', () => {
                const prefilledProps = {
                    'addresses': [{
                        'street': 'Rue de la paix'
                    }]
                };
                const wrapper = mountWithContext(
                    <Form {...defaultProps} collection={ArrayOfObjects} prefilledProps={prefilledProps} />
                );
                const input = wrapper.find('input');
                expect(input).toHaveLength(1);
                expect(input.prop('value')).toEqual('Rue de la paix');
            });
            it('passes down prefilled props to objects nested in array', () => {
                const prefilledProps = {
                    'addresses.$': {
                        'street': 'Rue de la paix'
                    }
                };
                const wrapper = mountWithContext(
                    <Form {...defaultProps} collection={ArrayOfObjects} prefilledProps={prefilledProps} />
                );
                // press the add button
                wrapper.find('button.form-nested-add').first().simulate('click');
                const input = wrapper.find('input');
                expect(input.prop('value')).toEqual('Rue de la paix');
            });
            it('combine prefilled prop for array and for array item', () => {
                const prefilledProps = {
                    'addresses': [{
                        street: 'first'
                    }],
                    'addresses.$': {
                        'street': 'second'
                    }
                };
                const wrapper = mountWithContext(
                    <Form {...defaultProps} collection={ArrayOfObjects} prefilledProps={prefilledProps} />
                );
                // first input matches the array default value
                const input1 = wrapper.find('input').at(0);
                expect(input1.prop('value')).toEqual('first');
                // newly created input matches the child default value
                wrapper.find('button.form-nested-add').simulate('click'); // 1st button = deletion, 2nd button = add
                expect(wrapper.find('input')).toHaveLength(2);
                const input2 = wrapper.find('input').at(1); // second input
                expect(input2.prop('value')).toEqual('second');
            });
        });
        describe('array with custom children inputs (e.g array of url)', function () {
            it('shallow render', function () {
                const wrapper = shallowWithContext(<Form {...defaultProps} collection={ArrayOfUrls} />);
                expect(wrapper).toBeDefined();
            });
            it('passes down the array item custom input', () => {
                const wrapper = shallowWithContext(<Form {...defaultProps} collection={ArrayOfUrls} />);
                const formGroup = getArrayFormGroup(wrapper);
                const fields = getFields(formGroup);
                const arrayField = fields[0];
                expect(arrayField.arrayField).toBeDefined();
            });
        });
        describe('array of objects with custom children inputs', function () {
            it('shallow render', function () {
                const wrapper = shallowWithContext(
                    <Form {...defaultProps} collection={ArrayOfCustomObjects} />
                );
                expect(wrapper).toBeDefined();
            });
            // TODO: does not work, schema_utils needs an update
            it.skip('passes down the custom input', function () {
                const wrapper = shallowWithContext(
                    <Form {...defaultProps} collection={ArrayOfCustomObjects} />
                );
                const formGroup = getArrayFormGroup(wrapper);
                const fields = getFields(formGroup);
                const arrayField = fields[0];
                expect(arrayField.arrayField).toBeDefined();
            });
        });
        describe('array with a fully custom input (array itself and children)', function () {
            it('shallow render', function () {
                const wrapper = shallowWithContext(
                    <Form {...defaultProps} collection={ArrayFullCustom} />
                );
                expect(wrapper).toBeDefined();
            });
            it('passes down the custom input', function () {
                const wrapper = shallowWithContext(
                    <Form {...defaultProps} collection={ArrayFullCustom} />
                );
                const formGroup = getArrayFormGroup(wrapper);
                const fields = getFields(formGroup);
                const arrayField = fields[0];
                expect(arrayField.arrayField).toBeDefined();
            });
        });
    });

    describe('Form state management', function () {
        // TODO: the change callback is triggerd but `foo` becomes null instead of "bar
        // so it's added to the deletedValues and not changedValues
        it.skip('store typed value', function () {
            const wrapper = mountWithContext(<Form {...defaultProps} collection={Foos} />);
            //console.log(wrapper.state());
            wrapper
                .find('input')
                .first()
                .simulate('change', { target: { value: 'bar' } });
            // eslint-disable-next-line no-console
            console.log(
                wrapper
                    .find('input')
                    .first()
                    .html()
            );
            // eslint-disable-next-line no-console
            console.log(wrapper.state());
            expect(wrapper.state().currentValues).toEqual({ foo: 'bar' });
        });
        it('reset state when relevant props change', function () {
            const wrapper = shallowWithContext(
                <Form {...defaultProps} collectionName="Foos" collection={Foos} />
            );
            wrapper.setState({ currentValues: { foo: 'bar' } });
            expect(wrapper.state('currentValues')).toEqual({ foo: 'bar' });
            wrapper.setProps({ collectionName: 'Bars' });
            expect(wrapper.state('currentValues')).toEqual({});
        });
        it('does not reset state when external prop change', function () {
            //const prefilledProps = { bar: 'foo' } // TODO
            const changeCallback = () => 'CHANGE';
            const wrapper = shallowWithContext(
                <Form {...defaultProps} collection={Foos} changeCallback={changeCallback} />
            );
            wrapper.setState({ currentValues: { foo: 'bar' } });
            expect(wrapper.state('currentValues')).toEqual({ foo: 'bar' });
            const newChangeCallback = () => 'NEW';
            wrapper.setProps({ changeCallback: newChangeCallback });
            expect(wrapper.state('currentValues')).toEqual({ foo: 'bar' });
        });
    });
});