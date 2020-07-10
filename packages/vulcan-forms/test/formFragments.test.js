import expect from 'expect';
import { print } from 'graphql/language/printer';

import SimpleSchema from 'simpl-schema';
import getFormFragments from '../lib/modules/formFragments';
const test = it;

// allow to easily test regex on a graphql string
// all blanks and series of blanks are replaces by one single space
const normalizeFragment = gqlSchema => print(gqlSchema).replace(/\s+/g, ' ').trim();

const defaultArgs = {
    formType: 'new',
    collectionName: 'Foos',
    typeName: 'Foo'
};
describe('vulcan:form/formFragments', function () {
    test('generate valid query and mutation fragment', () => {
        const schema = new SimpleSchema({
            field: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins']
            },
            nonCreateableField: {
                type: String,
                canRead: ['admins'],
                canUpdate: ['admins']
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(queryFragment).toBeDefined();
        expect(mutationFragment).toBeDefined();
        expect(normalizeFragment(queryFragment)).toMatch('fragment FoosNewFormQueryFragment on Foo { field }');
        expect(normalizeFragment(mutationFragment)).toMatch('fragment FoosNewFormMutationFragment on Foo { field nonCreateableField }');
    });
    test('take formType into account', function () {
        const schema = new SimpleSchema({
            field: {
                type: String,
                canRead: ['admins'],
                canUpdate: ['admins']
            },
            // should not appear
            nonUpdateableField: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins']
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            formType: 'edit',
            schema,
        });
        expect(normalizeFragment(queryFragment)).toMatch('fragment FoosEditFormQueryFragment on Foo { field }');
        expect(normalizeFragment(mutationFragment)).toMatch('fragment FoosEditFormMutationFragment on Foo { field nonUpdateableField }');

    });
    test('create subfields for nested objects', () => {
        const schema = new SimpleSchema({
            nestedField: {

                canCreate: ['admins'],
                type: new SimpleSchema({
                    firstNestedField: {
                        canCreate: ['admins'],
                        type: String,
                    },
                    secondNestedField: {
                        canCreate: ['admins'],
                        type: Number
                    }
                })
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(normalizeFragment(queryFragment)).toMatch('fragment FoosNewFormQueryFragment on Foo { nestedField { firstNestedField secondNestedField } }');
        expect(normalizeFragment(mutationFragment)).toMatch('fragment FoosNewFormMutationFragment on Foo { nestedField { firstNestedField secondNestedField } }');
    });
    test('create subfields for arrays of nested objects', () => {
        const schema = new SimpleSchema({
            arrayField: {
                type: Array,
                canRead: ['admins'],
                canCreate: ['admins']
            },
            'arrayField.$': {
                canCreate: ['admins'],
                type: new SimpleSchema({
                    firstNestedField: {
                        canCreate: ['admins'],
                        type: String,
                    },
                    secondNestedField: {
                        canCreate: ['admins'],
                        type: Number
                    }
                })
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(normalizeFragment(queryFragment)).toMatch('fragment FoosNewFormQueryFragment on Foo { arrayField { firstNestedField secondNestedField } }');
        expect(normalizeFragment(mutationFragment)).toMatch('fragment FoosNewFormMutationFragment on Foo { arrayField { firstNestedField secondNestedField } }');
    });
    test('add readable fields to mutation fragment', () => {
        const schema = new SimpleSchema({
            field: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins']
            },
            readOnlyField: {
                type: String,
                canRead: ['admins']
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(normalizeFragment(queryFragment)).not.toMatch('readOnlyField'); // this does not affect the queryFragment;
        expect(normalizeFragment(mutationFragment)).toMatch('fragment FoosNewFormMutationFragment on Foo { field readOnlyField }');
    });
    test('ignore virtual/resolved fields', () => {
        const schema = new SimpleSchema({
            field: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins'],
                resolveAs: {
                    fieldName: 'resolvedField',
                    type: 'Whatever',
                    addOriginalField: true,
                    resolver: () => ({})
                }
            },
            virtual: {
                type: String,
                canRead: ['admins'],
                resolveAs: {
                    type: 'Whatever',
                    resolver: () => ({})
                }
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(normalizeFragment(queryFragment)).not.toMatch('virtual');
        expect(normalizeFragment(mutationFragment)).toMatch('fragment FoosNewFormMutationFragment on Foo { field }');

    });
    test("add userId and _id when they are present in the schema", () => {
        const schemaWithIds = new SimpleSchema({
            _id: {
                type: String,
                canRead: ['guests'],
            },
            userId: {
                type: String,
                canRead: ['guests']
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema: schemaWithIds,
        });
        expect(normalizeFragment(queryFragment)).toMatch(/_id/);
        expect(normalizeFragment(mutationFragment)).toMatch(/_id/);
        expect(normalizeFragment(queryFragment)).toMatch(/userId/);
        expect(normalizeFragment(mutationFragment)).toMatch(/userId/);
    })
    test("do not add _id and userId if not in the schema", () => {
        const schemaWithoutIds = new SimpleSchema({
            field: {
                type: String,
                canRead: ['guests'],
                canCreate: ['guests']
            },
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema: schemaWithoutIds,
        });
        expect(normalizeFragment(queryFragment)).not.toMatch(/_id/);
        expect(normalizeFragment(mutationFragment)).not.toMatch(/_id/);
        expect(normalizeFragment(queryFragment)).not.toMatch(/userId/);
        expect(normalizeFragment(mutationFragment)).not.toMatch(/userId/);
    })
});

