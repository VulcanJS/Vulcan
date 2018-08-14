// setup JSDOM server side for testing (necessary for Enzyme to mount)
import 'jsdom-global/register'
import React from 'react'
// TODO: should be loaded from Components instead?
import Form from '../lib/components/Form'
import FormGroup from "../lib/components/FormGroup"
import FormComponent from "../lib/components/FormComponent"
import '../lib/components/FormNestedArray'
import expect from 'expect'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import { Components } from "meteor/vulcan:core"

// setup enzyme
// TODO: write a reusable helper and move this to the tests setup
Enzyme.configure({ adapter: new Adapter() })

// we must import all the other components, so that "registerComponent" is called
import "../lib/modules/components"
// and then load them in the app so that <Component.Whatever /> is defined
import { populateComponentsApp, initializeFragments } from "meteor/vulcan:lib"
// we need registered fragments to be initialized because populateComponentsApp will run 
// hocs, like withUpdate, that rely on fragments
initializeFragments()
// actually fills the Components object
populateComponentsApp()



// fixtures
import SimpleSchema from "simpl-schema";
const addressGroup = {
    name: "addresses",
    label: "Addresses",
    order: 10
};
const addressSchema = {
    street: {
        type: String,
        optional: true,
        viewableBy: ["guests"],
        editableBy: ["quests"],
        insertableBy: ["quests"],
        max: 100 // limit street address to 100 characters
    },
};
const arraySchema = {
    addresses: {
        type: Array,
        viewableBy: ["guests"],
        editableBy: ["quests"],
        insertableBy: ["quests"],
        group: addressGroup
    },
    "addresses.$": {
        type: new SimpleSchema(addressSchema)
    }
};
const objectSchema = {
    addresses: {
        type: new SimpleSchema(addressSchema),
        viewableBy: ["guests"],
        editableBy: ["quests"],
        insertableBy: ["quests"],
    },
};

// stub collection
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
const WithArrays = createCollection({
    collectionName: 'WithArrays',
    typeName: 'WithArray',
    schema: arraySchema,
    resolvers: getDefaultResolvers('WithArrays'),
    mutations: getDefaultMutations('WithArrays'),
});
const WithObjects = createCollection({
    collectionName: 'WithObjects',
    typeName: 'WithObject',
    schema: objectSchema,
    resolvers: getDefaultResolvers('WithObjects'),
    mutations: getDefaultMutations('WithObjects'),
});

const Addresses = createCollection({
    collectionName: 'Addresses',
    typeName: 'Address',
    schema: addressSchema,
    resolvers: getDefaultResolvers('Addresses'),
    mutations: getDefaultMutations('Addresses'),
})

// tests
describe('vulcan-forms/components', function () {
    describe('Form', function () {
        const context = {
            intl: {
                formatMessage: () => "",
                formatDate: () => "",
                formatTime: () => "",
                formatRelative: () => "",
                formatNumber: () => "",
                formatPlural: () => "",
                formatHTMLMessage: () => ""
            }

        }
        const mountWithContext = C => mount(C, {
            context
        })
        const shallowWithContext = C => shallow(C, {
            context
        })
        describe('basic', function () {
            it('shallow render', function () {
                const wrapper = shallowWithContext(<Form collection={Addresses} />)
                expect(wrapper).toBeDefined()
            })
        })
        describe('nested array', function () {
            it('shallow render', () => {
                const wrapper = shallowWithContext(<Form collection={WithArrays} />)
                expect(wrapper).toBeDefined()
            })
            it('render a FormGroup for addresses', function () {
                const wrapper = shallowWithContext(<Form collection={WithArrays} />)
                const formGroup = wrapper.find('FormGroup').find({ name: 'addresses' })
                expect(formGroup).toBeDefined()
                expect(formGroup).toHaveLength(1)
            })
        })
        describe('nested object', function () {
            it('shallow render', () => {
                const wrapper = shallowWithContext(<Form collection={WithObjects} />)
                expect(wrapper).toBeDefined()
            })
            it('define one field', () => {
                const wrapper = shallowWithContext(<Form collection={WithObjects} />)
                const defaultGroup = wrapper.find('FormGroup').first()
                const fields = defaultGroup.prop('fields')
                expect(fields).toHaveLength(1) // addresses field
            })

            const getFormFields = (wrapper) => {
                const defaultGroup = wrapper.find('FormGroup').first()
                const fields = defaultGroup.prop('fields')
                return fields
            }
            const getFirstField = () => {
                const wrapper = shallowWithContext(<Form collection={WithObjects} />)
                const fields = getFormFields(wrapper)
                return fields[0]
            }
            it('define the nestedSchema', () => {
                const addressField = getFirstField()
                expect(addressField.nestedSchema.street).toBeDefined()
            })
        })
    })

    describe('FormComponent', function () {
        const shallowWithContext = C => shallow(C, {
            context: {
                getDocument: () => { }
            }
        })
        const defaultProps = {
            "disabled": false,
            "optional": true,
            "document": {},
            "name": "meetingPlace",
            "path": "meetingPlace",
            "datatype": [{ type: Object }],
            "layout": "horizontal",
            "label": "Meeting place",
            "currentValues": {},
            "formType": "new",
            deletedValues: [],
            throwError: () => { },
            updateCurrentValues: () => { },
            errors: [],
            clearFieldErrors: () => { },
        }
        it('shallow render', function () {
            const wrapper = shallowWithContext(<FormComponent {...defaultProps} />)
            expect(wrapper).toBeDefined()
        })
        describe('nested array', function () {
            const props = {
                ...defaultProps,
                "datatype": [{ type: Array }],
                "nestedSchema": {
                    "street": {},
                    "country": {},
                    "zipCode": {}
                },
                "nestedInput": true,
                "nestedFields": [
                    {},
                    {},
                    {}
                ],
                "currentValues": {},
            }
            it('render a FormNestedArray', function () {
                const wrapper = shallowWithContext(<FormComponent {...props} />)
                const formNested = wrapper.find('FormNestedArray')
                expect(formNested).toHaveLength(1)
            })
        })
        describe('nested object', function () {
            const props = {
                ...defaultProps,
                "datatype": [{ type: new SimpleSchema({}) }],
                "nestedSchema": {
                    "street": {},
                    "country": {},
                    "zipCode": {}
                },
                "nestedInput": true,
                "nestedFields": [
                    {},
                    {},
                    {}
                ],
                "currentValues": {},
            }
            it('shallow render', function () {
                const wrapper = shallowWithContext(<FormComponent {...props} />)
                expect(wrapper).toBeDefined()
            })
            it('render a FormNestedObject', function () {
                const wrapper = shallowWithContext(<FormComponent {...props} />)
                const formNested = wrapper.find('FormNestedObject')
                expect(formNested).toHaveLength(1)
            })
        })
    })

    describe('FormNestedArray', function () {
        it('shallow render', function () {
            const wrapper = shallow(<Components.FormNestedArray path="foobar" currentValues={{}} />)
            expect(wrapper).toBeDefined()
        })
        it('shows a button', function () {
            const wrapper = shallow(<Components.FormNestedArray path="foobar" currentValues={{}} />)
            const button = wrapper.find('BootstrapButton')
            expect(button).toHaveLength(1)
        })
        it('shows an add button', function () {
            const wrapper = shallow(<Components.FormNestedArray path="foobar" currentValues={{}} />)
            const addButton = wrapper.find('IconAdd')
            expect(addButton).toHaveLength(1)
        })
    })
    describe('FormNestedObject', function () {
        it('shallow render', function () {
            const wrapper = shallow(<Components.FormNestedObject path="foobar" currentValues={{}} />)
            expect(wrapper).toBeDefined()
        })
        it.skip('render a form for the object', function () {
            const wrapper = shallow(<Components.FormNestedObject path="foobar" currentValues={{}} />)
            expect(false).toBe(true)
        })
        it('does not show any button', function () {
            const wrapper = shallow(<Components.FormNestedObject path="foobar" currentValues={{}} />)
            const button = wrapper.find('BootstrapButton')
            expect(button).toHaveLength(0)
        })
        it('does not show add button', function () {
            const wrapper = shallow(<Components.FormNestedObject path="foobar" currentValues={{}} />)
            const addButton = wrapper.find('IconAdd')
            expect(addButton).toHaveLength(0)
        })
        it('does not show remove button', function () {
            const wrapper = shallow(<Components.FormNestedObject path="foobar" currentValues={{}} />)
            const removeButton = wrapper.find('IconRemove')
            expect(removeButton).toHaveLength(0)
        })
    })
})