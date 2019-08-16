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
describe('vulcan-forms/components', function () {
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

  describe('Form collectionName="" (handle fields computation)', function () {
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
          const wrapper = shallowWithContext(<Form collectionName="" collection={Addresses} />);
          expect(wrapper).toBeDefined();
        });
      });
      describe('nested object (not in array)', function () {
        it('shallow render', () => {
          const wrapper = shallowWithContext(<Form collectionName="" collection={Objects} />);
          expect(wrapper).toBeDefined();
        });
        it('define one field', () => {
          const wrapper = shallowWithContext(<Form collectionName="" collection={Objects} />);
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
          const wrapper = shallowWithContext(<Form collectionName="" collection={Objects} />);
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
            <Form collectionName="" collection={ArrayOfObjects} />
          );
          expect(wrapper).toBeDefined();
        });
        it('render a FormGroup for addresses', function () {
          const wrapper = shallowWithContext(
            <Form collectionName="" collection={ArrayOfObjects} />
          );
          const formGroup = wrapper.find('FormGroup').find({ name: 'addresses' });
          expect(formGroup).toBeDefined();
          expect(formGroup).toHaveLength(1);
        });
        it('passes down the array child fields', function () {
          const wrapper = shallowWithContext(
            <Form collectionName="" collection={ArrayOfObjects} />
          );
          const formGroup = getArrayFormGroup(wrapper);
          const fields = getFields(formGroup);
          const arrayField = fields[0];
          expect(arrayField.nestedInput).toBe(true);
          expect(arrayField.nestedFields).toHaveLength(Object.keys(addressSchema).length);
        });
      });
      describe('array with custom children inputs (e.g array of url)', function () {
        it('shallow render', function () {
          const wrapper = shallowWithContext(<Form collectionName="" collection={ArrayOfUrls} />);
          expect(wrapper).toBeDefined();
        });
        it('passes down the array item custom input', () => {
          const wrapper = shallowWithContext(<Form collectionName="" collection={ArrayOfUrls} />);
          const formGroup = getArrayFormGroup(wrapper);
          const fields = getFields(formGroup);
          const arrayField = fields[0];
          expect(arrayField.arrayField).toBeDefined();
        });
      });
      describe('array of objects with custom children inputs', function () {
        it('shallow render', function () {
          const wrapper = shallowWithContext(
            <Form collectionName="" collection={ArrayOfCustomObjects} />
          );
          expect(wrapper).toBeDefined();
        });
        // TODO: does not work, schema_utils needs an update
        it.skip('passes down the custom input', function () {
          const wrapper = shallowWithContext(
            <Form collectionName="" collection={ArrayOfCustomObjects} />
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
            <Form collectionName="" collection={ArrayFullCustom} />
          );
          expect(wrapper).toBeDefined();
        });
        it('passes down the custom input', function () {
          const wrapper = shallowWithContext(
            <Form collectionName="" collection={ArrayFullCustom} />
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

  describe('FormComponent (select the components to render and handle state)', function () {
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

  describe('FormNestedArray', function () {
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

  describe('FormNestedObject', function () {
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
});
