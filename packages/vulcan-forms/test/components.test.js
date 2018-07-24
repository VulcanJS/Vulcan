// setup JSDOM server side for testing (necessary for Enzyme to mount)
import 'jsdom-global/register'
import React from 'react'
import Form from '../lib/components/Form'
import FormNested from '../lib/components/FormNested'
import expect from 'expect'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
// we must import all the other components, so that "registerComponent" is called
import "../lib/modules/components"



// setup enzyme
// TODO: write a reusable helper and move this to the tests setup
Enzyme.configure({ adapter: new Adapter() })

// fixtures
import SimpleSchema from "simpl-schema";
const addressGroup = {
    name: "addresses",
    label: "Addresses",
    order: 10
};
const addressSchema = new SimpleSchema({
    street: {
        type: String,
        optional: true,
        viewableBy: ["guests"],
        editableBy: ["members"],
        insertableBy: ["members"],
        max: 100 // limit street address to 100 characters
    },
});
const schema = {
    _id: {
        type: String,
        optional: true,
        viewableBy: ["guests"]
    },
    createdAt: {
        type: Date,
        optional: true,
        onInsert: (document, currentUser) => {
            return new Date();
        }
    },
    userId: {
        type: String,
        optional: true
    },
    name: {
        type: String,
        optional: false,
        viewableBy: ["guests"],
        editableBy: ["members"],
        insertableBy: ["members"],
        searchable: true // make field searchable
    },
    addresses: {
        type: Array,
        viewableBy: ["guests"],
        editableBy: ["members"],
        insertableBy: ["members"],
        group: addressGroup
    },
    "addresses.$": {
        type: addressSchema
    }
};

// stub collection
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core'
const Customers = createCollection({
    collectionName: 'Customers',
    typeName: 'Customer',
    schema,
    resolvers: getDefaultResolvers('Customers'),
    mutations: getDefaultMutations('Customers'),
});

const Addresses = createCollection({
    collectionName: 'Addresses',
    typeName: 'Address',
    schema: addressSchema,
    resolvers: getDefaultResolvers('Addresses'),
    mutations: getDefaultMutations('Addresses'),
})

describe('vulcan-forms/components', function () {
    describe('Form', function () {
        const mountWithContext = C => mount(C, {
            context: {
                intl: {
                    formatMessage: () => "",
                    formatDate: () => ""
                }
            }
        })
        const shallowWithContext = C => shallow(C, {
            context: {
                intl: {
                    formatMessage: () => "",
                    formatDate: () => "",
                    formatTime: () => ""
                }
            }
        })
        describe('basic', function () {
            it('shallow render', function () {
                const wrapper = shallowWithContext(<Form collection={Addresses} />)
                expect(wrapper).toBeDefined()
            })
        })
        describe('nested forms', function () {
            it('shallow render', () => {
                const wrapper = shallowWithContext(<Form collection={Customers} />)
                expect(wrapper).toBeDefined()
            })
        })
    })

    describe('FormNested', function () {
        it('mount', function () {
            const wrapper = shallow(<FormNested path="foobar" currentValues={{}} />)
            expect(wrapper).toBeDefined()

        })
    })
})