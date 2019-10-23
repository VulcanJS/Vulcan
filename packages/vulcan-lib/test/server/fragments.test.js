import expect from 'expect'

import SimpleSchema from 'simpl-schema';
import { createDummyCollection, normalizeGraphQLSchema } from 'meteor/vulcan:test'
import { getDefaultFragmentText } from '../../lib/modules/graphql/defaultFragment';
const test = it

const fooCollection = (schema) => createDummyCollection({
    collectionName: 'Foos',
    typeName: 'Foo',
    resolvers: null,
    mutations: null,
    schema
});

describe('default fragment generation', () => {
    test('generate default fragment for basic collection', () => {
        const collection = fooCollection({
            foo: {
                type: String,
                canRead: ['guests']
            },
            bar: {
                type: String,
                canRead: ['guests']
            }

        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { foo bar }');
    });
    test('generate default fragment with nested object', () => {
        const collection = fooCollection({
            foo: {
                type: String,
                canRead: ['guests']
            },
            nestedField: {
                canRead: ['guests'],
                type: new SimpleSchema({
                    bar: {
                        type: String,
                        canRead: ['guests']
                    }
                })
            }
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { foo nestedField { bar } }');
    });
    test('generate default fragment with blackbox JSON object (no nesting)', () => {
        const collection = fooCollection({
            foo: {
                type: String,
                canRead: ['guests']
            },
            object: {
                canRead: ['guests'],
                type: Object
            }
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { foo object }');
    });
    test('generate default fragment with nested array of objects', () => {
        const collection = fooCollection({
            arrayField: {
                type: Array,
                canRead: ['admins']

            },
            'arrayField.$': {
                type: new SimpleSchema({
                    subField: {
                        type: String,
                        canRead: ['admins']
                    }
                }),
                canRead: ['admins']
            }
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { arrayField { subField } }');
    });
    test('generate default fragment with array of native values', () => {
        const collection = fooCollection({
            arrayField: {
                type: Array,
                canRead: ['admins']

            },
            'arrayField.$': {
                type: Number,
                canRead: ['admins']
            }
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { arrayField }');

    });

    test('ignore resolved fields with a an unknown type', () => {
        const collection = fooCollection({
            // ignored in default fragments because we don't know People type
            object: {
                type: Object,
                canRead: ['admins'],
                resolveAs: {
                    fieldName: 'resolvedObject',
                    type: 'People',
                    resolver: () => (null)
                }
            },
            // dummy field to avoid empty fragment
            foo: {
                type: String,
                canRead: ['admins']
            }
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { foo }');

    })
    test('add field with resolveAs only if addOriginalField is true', () => {
        const collection = fooCollection({
            json: {
                type: Object,
                canRead: ['admins'],
                resolveAs: {
                    fieldName: 'resolvedJSON',
                    type: 'JSON',
                    resolver: () => null,
                    addOriginalField: true
                }
            },
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { json }');
    });
    test('add original field if at least one addOriginalField is true', () => {
        const collection = fooCollection({
            // ignored in default fragments
            foo: {
                type: String,
                canRead: ['admins'],
                resolveAs: [{
                    fieldName: 'resolvedObject',
                    type: 'String',
                    resolver: () => (null)
                }, {
                    fieldName: 'anotherResolvedObject',
                    type: 'String', resolver: () => null,
                    addOriginalField: true
                }]
            },
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { foo resolvedObject anotherResolvedObject }');
    })
    test('ignore referenced schemas', () => {
        const collection = fooCollection({
            field: {
                type: String,
                canRead: ['admins']
            },
            // ignored in default fragments
            address: {
                type: Object,
                typeName: 'Address',
                canRead: ['admins'],
            },
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { field }');
    });
    test('ignore referenced schemas in array child', () => {
        const collection = fooCollection({
            field: {
                type: String,
                canRead: ['admins']
            },
            emails: {
                type: Array,
                optional: true,
                canRead: ['admin']
            },
            'emails.$': {
                type: Object,
                typeName: 'UserEmail',
                optional: true,
            },
        });
        const fragment = getDefaultFragmentText(collection);
        const normalizedFragment = normalizeGraphQLSchema(fragment);
        expect(normalizedFragment).toMatch('fragment FoosDefaultFragment on Foo { field }');
    });
});