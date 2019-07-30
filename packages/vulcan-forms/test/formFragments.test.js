import expect from 'expect';

import SimpleSchema from 'simpl-schema';
import getFormFragments from '../lib/modules/formFragments';
const test = it;

// allow to easily test regex on a graphql string
// all blanks and series of blanks are replaces by one single space
const normalizeGraphQLSchema = gqlSchema => gqlSchema.replace(/\s+/g, ' ').trim();

const defaultArgs = {
    formType: 'new',
    collectionName: 'Foos'
};
describe('vulcan:form/formFragments', function () {
    test('generate valid query and mutation fragment', () => {
        const schema = new SimpleSchema({
            field: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins']
            },
            nonCreatetableField: {
                type: String,
                canRead: ['admins'],
                canUpdate: ['admins']
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(normalizeGraphQLSchema(queryFragment)).toMatch('fragment CreateFooFormFragment on Foo { field }');
        expect(normalizeGraphQLSchema(mutationFragment)).toMatch('fragment CreateFooFormFragment on Foo { field }');
    });
    test('take formType into account', function () {
        const schema = new SimpleSchema({
            field: {
                type: String,
                canRead: ['admins'],
                canUpdate: ['admins']
            },
            // should not appear
            nonUpdateablefield: {
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
        expect(normalizeGraphQLSchema(queryFragment)).toMatch('fragment CreateFooFormFragment on Foo { field }');
        expect(normalizeGraphQLSchema(mutationFragment)).toMatch('fragment CreateFooFormFragment on Foo { field }');

    });
    test('create subfields for nested objects', () => {
        const schema = new SimpleSchema({
            nestedField: {
                type: new SimpleSchema({
                    firstNestedField: {
                        type: String,
                    },
                    secondNestedField: {
                        type: Number
                    }
                })
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(normalizeGraphQLSchema(queryFragment)).toMatch('fragment CreateFooFormFragment on Foo { nestedField { firstNestedField secondNestedField } }');
        expect(normalizeGraphQLSchema(mutationFragment)).toMatch('fragment CreateFooFormFragment on Foo { nestedField { firstNestedField secondNestedField } }');
    });
    test('create subfields for arrays of nested objects', () => {
        const schema = new SimpleSchema({
            arrayField: {
                type: Array,
                canRead: ['admins']
            },
            'arrayField.$': {
                type: new SimpleSchema({
                    firstNestedField: {
                        type: String,
                    },
                    secondNestedField: {
                        type: Number
                    }
                })
            }
        })._schema;
        const { queryFragment, mutationFragment } = getFormFragments({
            ...defaultArgs,
            schema,
        });
        expect(normalizeGraphQLSchema(queryFragment)).toMatch('fragment CreateFooFormFragment on Foo { arrayField { firstNestedField secondNestedField } }');
        expect(normalizeGraphQLSchema(mutationFragment)).toMatch('fragment CreateFooFormFragment on Foo { arrayField { firstNestedField secondNestedField } }');
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
        expect(normalizeGraphQLSchema(queryFragment)).not.toMatch('readOnlyField'); // this does not affect the queryFragment;
        expect(normalizeGraphQLSchema(mutationFragment)).toMatch('fragment CreateFooFormFragment on Foo { field readOnlyField }');
    });
});

