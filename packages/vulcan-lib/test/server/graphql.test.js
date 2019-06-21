import expect from 'expect';

import { GraphQLSchema } from '../../lib/modules/graphql';
import initGraphQL from '../../lib/server/apollo-server/initGraphQL';

//import collectionToGraphQL from '../../lib/modules/graphql/collectionToSchema';
import collectionToGraphQL from '../../lib/modules/graphql/collection';
import { getSchemaFields, getGraphQLType } from '../../lib/modules/graphql/schemaFields';
import { getDefaultFragmentText } from '../../lib/modules/graphql/defaultFragment';
import SimpleSchema from 'simpl-schema';
const test = it;

const makeDummyCollection = (schema) => ({
  options: {
    collectionName: 'Foos'
  },
  typeName: 'Foo',
  simpleSchema: () => new SimpleSchema(schema)
});

// allow to easily test regex on a graphql string
// all blanks and series of blanks are replaces by one single space
const normalizeGraphQLSchema = gqlSchema => gqlSchema.replace(/\s+/g, ' ').trim();

describe('vulcan:lib/graphql', function () {
  // TODO: handle the graphQL init better to fix those tests
  it.skip('throws if graphql schema is not initialized', function () {
    expect(() => GraphQLSchema.getSchema()).toThrow();
  });
  it.skip('throws if executable schema is not initialized', function () {
    expect(() => GraphQLSchema.getExecutableSchema()).toThrow();
  });
  it('can access the graphql schema', function () {
    GraphQLSchema.init();
    initGraphQL();
    expect(GraphQLSchema.getSchema()).toBeDefined();
  });
  it('can access the executable graphql schema', function () {
    GraphQLSchema.init();
    initGraphQL();
    expect(GraphQLSchema.getExecutableSchema()).toBeDefined();
  });


  describe('schemaFields - graphql fields generation from simple schema', () => {
    describe('getGraphQLType', () => {
      test('return nested type for nested objects', () => {
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
        const type = getGraphQLType({ schema, fieldName: 'nestedField', typeName: 'Foo' });
        expect(type).toBe('FooNestedField');
      });
      /*test('return JSON for nested objects with blackbox option', () => {
        // TODO: this test might actually be incorrect,
        // the schema needs to be initialized by the collection
        const schema = new SimpleSchema({
          nestedField: {
            optional: true,
            blackbox: true,
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
        const type = getGraphQLType({schema, fieldName:'nestedField', typeName: 'Foo'});
        expect(type).toBe('JSON');
      });*/
      test('return JSON for nested objects that are actual JSON objects', () => {
        const schema = new SimpleSchema({
          nestedField: {
            type: Object,
          }
        })
          ._schema;
        const type = getGraphQLType({ schema, fieldName: 'nestedField', typeName: 'Foo' });
        expect(type).toBe('JSON');
      });

      test('return nested  array type for arrays of nested objects', () => {
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
        const type = getGraphQLType({ schema, fieldName: 'arrayField', typeName: 'Foo' });
        expect(type).toBe('[FooArrayField]');
      });
      test('return basic array type for array of primitives', () => {
        const schema = new SimpleSchema({
          arrayField: {
            type: Array,
            canRead: ['admins']
          },
          'arrayField.$': {
            type: String
          }
        })._schema;
        const type = getGraphQLType({ schema, fieldName: 'arrayField', typeName: 'Foo' });
        expect(type).toBe('[String]');
      });
    });

    describe('getSchemaFields', () => {

      test('fields without permissions are ignored', () => {
        const schema = new SimpleSchema({
          field: {
            type: String,
            canRead: ['admins']
          },
          ignoredField: {
            type: String,
          }
        })._schema;
        const fields = getSchemaFields(schema, 'Foo');
        const mainType = fields.fields.mainType;
        expect(mainType).toHaveLength(1);
        expect(mainType[0].name).toEqual('field');
      });
      test('nested fields without permissions are ignored', () => {
        const schema = new SimpleSchema({
          nestedField: {
            type: new SimpleSchema({
              firstNestedField: {
                type: String,
                canRead: ['admins']
              },
              ignoredNestedField: {
                type: Number,
              }
            }),
            canRead: ['admins']
          }
        })._schema;
        const fields = getSchemaFields(schema, 'Foo');
        const nestedFields = fields.nestedFieldsList[0];
        // one field in the nested object
        expect(nestedFields.fields.mainType).toHaveLength(1);
        expect(nestedFields.fields.mainType[0].name).toEqual('firstNestedField');
      });
      test('generate fields for nested objects', () => {
        const schema = new SimpleSchema({
          nestedField: {
            type: new SimpleSchema({
              firstNestedField: {
                type: String,
                canRead: ['admins']
              },
              secondNestedField: {
                type: Number,
                canRead: ['admins']
              }
            }),
            canRead: ['admins']
          }
        })._schema;

        const fields = getSchemaFields(schema, 'Foo');
        // one nested object
        expect(fields.nestedFieldsList).toHaveLength(1);
        const nestedFields = fields.nestedFieldsList[0];
        expect(nestedFields.typeName).toEqual('FooNestedField');
        // one field in the nested object
        expect(nestedFields.fields.mainType).toHaveLength(2);
        expect(nestedFields.fields.mainType[0].name).toEqual('firstNestedField');
        expect(nestedFields.fields.mainType[1].name).toEqual('secondNestedField');
      });

    });
  });
  describe('collection to GraphQL type', () => {
    test('generate a type for a simple collection', () => {
      const collection = makeDummyCollection({
        field: {
          type: String,
          canRead: ['admins']
        }
      });
      const res = collectionToGraphQL(collection);
      expect(res.graphQLSchema).toBeDefined();
      // debug
      //console.log(res.graphQLSchema);
      const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
      expect(normalizedSchema).toMatch('type Foo { field: String }');
    });
    test('generate type for a nested field', () => {
      const collection = makeDummyCollection({
        nestedField: {
          type: new SimpleSchema({
            subField: {
              type: String,
              canRead: ['admins']
            }
          }),
          canRead: ['admins']
        }
      });
      const res = collectionToGraphQL(collection);
      const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
      expect(normalizedSchema).toMatch('type Foo { nestedField: FooNestedField }');
      expect(normalizedSchema).toMatch('type FooNestedField { subField: String }');
    });
    test('generate graphQL type for array of nested objects', () => {
      const collection = makeDummyCollection({
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
      const res = collectionToGraphQL(collection);
      const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
      expect(normalizedSchema).toMatch('type Foo { arrayField: [FooArrayField] }');
      expect(normalizedSchema).toMatch('type FooArrayField { subField: String }');
    });

    describe('enums', () => {
      test('generate enum type when allowedValues is defined and field is a string', () => {
        const collection = makeDummyCollection({
          withAllowedField: {
            type: String,
            canRead: ['admins'],
            allowedValues: ['foo', 'bar']
          }
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { withAllowedField: FooWithAllowedFieldEnum }');
        expect(normalizedSchema).toMatch('enum FooWithAllowedFieldEnum { foo bar }');
      });

    });
  });

  describe('default fragment generation', () => {
    test('generate default fragment for basic collection', () => {
      const collection = makeDummyCollection({
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
      const collection = makeDummyCollection({
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
      const collection = makeDummyCollection({
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
      const collection = makeDummyCollection({
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
      const collection = makeDummyCollection({
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
  });
});
