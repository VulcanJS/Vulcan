import expect from 'expect';

import { GraphQLSchema } from '../../lib/server/graphql';
import initGraphQL from '../../lib/server/apollo-server/initGraphQL';
//import { getIntlString } from '../../lib/modules/intl'
import { addIntlFields } from '../../lib/modules/collections';

//import collectionToGraphQL from '../../lib/modules/graphql/collectionToSchema';
import collectionToGraphQL from '../../lib/server/graphql/collection';
import { getSchemaFields } from '../../lib/server/graphql/schemaFields';
import { getGraphQLType } from '../..//lib/modules/graphql/utils.js';
import { generateResolversFromSchema } from '../../lib/server/graphql/resolvers';
import SimpleSchema from 'simpl-schema';
import { createDummyCollection, normalizeGraphQLSchema } from 'meteor/vulcan:test';
import Users from 'meteor/vulcan:users';

const test = it;

const fooCollection = schema =>
  createDummyCollection({
    collectionName: 'Foos',
    typeName: 'Foo',
    resolvers: null,
    mutations: null,
    schema,
  });

describe('vulcan:lib/graphql', function() {
  // TODO: handle the graphQL init better to fix those tests
  it.skip('throws if graphql schema is not initialized', function() {
    expect(() => GraphQLSchema.getSchema()).toThrow();
  });
  it.skip('throws if executable schema is not initialized', function() {
    expect(() => GraphQLSchema.getExecutableSchema()).toThrow();
  });
  it('can access the graphql schema', function() {
    GraphQLSchema.init();
    initGraphQL();
    expect(GraphQLSchema.getSchema()).toBeDefined();
  });
  it('can access the executable graphql schema', function() {
    GraphQLSchema.init();
    initGraphQL();
    expect(GraphQLSchema.getExecutableSchema()).toBeDefined();
  });

  describe('generateResolversFromSchema - generate a secure resolver for each field', () => {
    const context = {
      currentUser: null,
      Users,
    };
    test('get the resolvers for a field', () => {
      const resolvers = generateResolversFromSchema(
        new SimpleSchema({
          foo: {
            type: String,
            canRead: ['guests'],
          },
        })
      );
      const fooResolver = resolvers['foo'];
      expect(fooResolver).toBeInstanceOf(Function);
      expect(fooResolver({ foo: 'bar' }, null, context)).toEqual('bar');
    });
    test('ignore non readable fields', () => {
      const resolvers = generateResolversFromSchema(
        new SimpleSchema({
          foo: {
            type: String,
            canRead: ['admins'],
          },
        })
      );
      const fooResolver = resolvers['foo'];
      expect(fooResolver({ foo: 'bar' }, null, context)).toBeNull();
    });
    test('convert undefined fields into null', () => {
      const resolvers = generateResolversFromSchema(
        new SimpleSchema({
          foo: {
            type: String,
            canRead: ['admins'],
          },
        })
      );
      const fooResolver = resolvers['foo'];
      expect(fooResolver({ foo2: 'bar' }, null, context)).toBeNull();
    });
    test('do NOT convert other falsy fields into null', () => {
      const resolvers = generateResolversFromSchema(
        new SimpleSchema({
          foo: {
            type: Number,
            canRead: ['guests'],
          },
        })
      );
      const fooResolver = resolvers['foo'];
      expect(fooResolver({ foo: 0 }, null, context)).toEqual(0);
    });
  });

  describe('schemaFields - graphql fields generation from simple schema', () => {
    describe('getGraphQLType - associate a graphQL type to a field', () => {
      test('return nested type for nested objects', () => {
        const schema = new SimpleSchema({
          nestedField: {
            type: new SimpleSchema({
              firstNestedField: {
                type: String,
              },
              secondNestedField: {
                type: Number,
              },
            }),
          },
        })._schema;
        const type = getGraphQLType({ schema, fieldName: 'nestedField', typeName: 'Foo' });
        expect(type).toBe('FooNestedField');
      });
      test('return JSON for nested objects with blackbox option', () => {
        const schema = new SimpleSchema({
          nestedField: {
            optional: true,
            blackbox: true,
            type: new SimpleSchema({
              firstNestedField: {
                type: String,
              },
              secondNestedField: {
                type: Number,
              },
            }),
          },
        })._schema;
        const type = getGraphQLType({ schema, fieldName: 'nestedField', typeName: 'Foo' });
        expect(type).toBe('JSON');
      });
      test('return JSON for nested objects that are actual JSON objects', () => {
        const schema = new SimpleSchema({
          nestedField: {
            type: Object,
          },
        })._schema;
        const type = getGraphQLType({ schema, fieldName: 'nestedField', typeName: 'Foo' });
        expect(type).toBe('JSON');
      });
      test('return JSON for child of blackboxed array', () => {
        const schema = new SimpleSchema({
          arrayField: {
            type: Array,
            blackbox: true,
          },
          'arrayField.$': {
            type: new SimpleSchema({
              someField: {
                type: String,
              },
            }),
          },
        })._schema;
        const type = getGraphQLType({ schema, fieldName: 'arrayField', typeName: 'Foo' });
        expect(type).toBe('[JSON]');
      });

      test('return JSON for input type if provided typeName is JSON', () => {
        const schema = new SimpleSchema({
          nestedField: {
            type: Object,
            typeName: 'JSON',
          },
        })._schema;
        const inputType = getGraphQLType({ schema, fieldName: 'nestedField', typeName: 'Foo', isInput: true });
        expect(inputType).toBe('JSON');
      });

      test('return nested  array type for arrays of nested objects', () => {
        const schema = new SimpleSchema({
          arrayField: {
            type: Array,
            canRead: ['admins'],
          },
          'arrayField.$': {
            type: new SimpleSchema({
              firstNestedField: {
                type: String,
              },
              secondNestedField: {
                type: Number,
              },
            }),
          },
        })._schema;
        const type = getGraphQLType({ schema, fieldName: 'arrayField', typeName: 'Foo' });
        expect(type).toBe('[FooArrayField]');
      });
      test('return basic array type for array of primitives', () => {
        const schema = new SimpleSchema({
          arrayField: {
            type: Array,
            canRead: ['admins'],
          },
          'arrayField.$': {
            type: String,
          },
        })._schema;
        const type = getGraphQLType({ schema, fieldName: 'arrayField', typeName: 'Foo' });
        expect(type).toBe('[String]');
      });

      test('return JSON if blackbox is true', () => {});
    });

    describe('getSchemaFields - get the fields to add to graphQL schema', () => {
      test('fields without permissions are ignored', () => {
        const schema = new SimpleSchema({
          field: {
            type: String,
            canRead: ['admins'],
          },
          ignoredField: {
            type: String,
          },
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
                canRead: ['admins'],
              },
              ignoredNestedField: {
                type: Number,
              },
            }),
            canRead: ['admins'],
          },
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
                canRead: ['admins'],
              },
              secondNestedField: {
                type: Number,
                canRead: ['admins'],
              },
            }),
            canRead: ['admins'],
          },
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
  describe('collection to GraphQL schema and type', () => {
    describe('basic', () => {
      test('generate a type for a simple collection', () => {
        const collection = fooCollection({
          field: {
            type: String,
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { field: String }');
      });
      test('use provided graphQL type if any', () => {
        const collection = createDummyCollection({
          collectionName: 'Foos',
          typeName: 'Foo',
          schema: {
            field: {
              type: String,
              typeName: 'StringEnum',
              canRead: ['admins'],
            },
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { field: StringEnum }');
      });
    });
    describe('nested objects and arrays', () => {
      test('generate type for a nested field', () => {
        const collection = fooCollection({
          nestedField: {
            type: new SimpleSchema({
              subField: {
                type: String,
                canRead: ['admins'],
              },
            }),
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { nestedField: FooNestedField }');
        expect(normalizedSchema).toMatch('type FooNestedField { subField: String }');
      });
      test('generate graphQL type for array of nested objects', () => {
        const collection = fooCollection({
          arrayField: {
            type: Array,
            canRead: ['admins'],
          },
          'arrayField.$': {
            type: new SimpleSchema({
              subField: {
                type: String,
                canRead: ['admins'],
              },
            }),
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { arrayField: [FooArrayField] }');
        expect(normalizedSchema).toMatch('type FooArrayField { subField: String }');
      });
      test('ignore field if parent is blackboxed', () => {
        const collection = fooCollection({
          blocks: {
            type: Array,
            canRead: ['admins'],
            blackbox: true,
          },
          'blocks.$': {
            type: new SimpleSchema({
              addresses: {
                type: Array,
                canRead: ['admins'],
              },
              'addresses.$': {
                type: new SimpleSchema({
                  street: {
                    type: String,
                    canRead: ['adminst'],
                  },
                }),
                canRead: ['admins'],
              },
            }),
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { blocks: [JSON] }');
      });
    });

    describe('nesting with referenced field', () => {
      test('use referenced graphQL type if provided for nested object', () => {
        const collection = fooCollection({
          nestedField: {
            type: Object,
            blackbox: true,
            typeName: 'AlreadyRegisteredNestedType',
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { nestedField: AlreadyRegisteredNestedType }');
        expect(normalizedSchema).not.toMatch('FooNestedField');
      });

      // TODO: does this test case make any sense?
      test('do NOT generate graphQL type if an existing graphQL type is referenced', () => {
        const collection = fooCollection({
          nestedField: {
            type: new SimpleSchema({
              subField: {
                type: String,
                canRead: ['admins'],
              },
            }),
            typeName: 'AlreadyRegisteredNestedType',
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { nestedField: AlreadyRegisteredNestedType }');
        expect(normalizedSchema).not.toMatch('FooNestedField');
      });
      test('do NOT generate graphQL type for array of nested objects if an existing graphQL type is referenced', () => {
        const collection = fooCollection({
          arrayField: {
            type: Array,
            canRead: ['admins'],
          },
          'arrayField.$': {
            typeName: 'AlreadyRegisteredType',
            type: new SimpleSchema({
              subField: {
                type: String,
                canRead: ['admins'],
              },
            }),
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { arrayField: [AlreadyRegisteredType] }');
        expect(normalizedSchema).not.toMatch('type FooArrayField { subField: String }');
      });
    });

    describe('intl', () => {
      test('generate type for intl fields', () => {
        const collection = fooCollection(
          addIntlFields(
            // we need to do this manually, it is handled by a callback when creating the collection
            {
              intlField: {
                intl: true,
                type: String,
                canRead: ['admins'],
              },
            }
          )
        );
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch(
          'type Foo { intlField(locale: String): String @intl intlField_intl(locale: String): [IntlValue] @intl }'
        );
      });
      test.skip('generate type for array of intl fields', () => {
        const collection = fooCollection(
          addIntlFields(
            // we need to do this manually, it is handled by a callback when creating the collection
            {
              arrayField: {
                type: Array,
                canRead: ['admins'],
              },
              'arrayField.$': {
                type: String,
                intl: true,
                canRead: ['admins'],
              },
            }
          )
        );
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { arrayField: [[IntlValue]] }');
      });
      test('generate correct type for nested intl fields', () => {
        const collection = fooCollection({
          nestedField: {
            type: new SimpleSchema(
              addIntlFields(
                // we need to do this manually, it is handled by a callback when creating the collection
                {
                  intlField: {
                    type: String,
                    intl: true,
                    canRead: ['admins'],
                  },
                }
              )
            ),
            canRead: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { nestedField: FooNestedField }');
        expect(normalizedSchema).toMatch(
          'type FooNestedField { intlField(locale: String): String @intl intlField_intl(locale: String): [IntlValue] @intl }'
        );
      });
    });

    describe('resolveAs', () => {
      test('generate a type for a field with resolveAs', () => {
        const collection = fooCollection({
          field: {
            type: String,
            canRead: ['admins'],
            resolveAs: {
              fieldName: 'field',
              type: 'Bar',
              resolver: async (user, args, { Users }) => {
                return 'bar';
              },
            },
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { field: Bar }');
      });
      test('generate a type for a field with addOriginalField=true', () => {
        const collection = fooCollection({
          field: {
            type: String,
            optional: true,
            canRead: ['admins'],
            resolveAs: {
              fieldName: 'resolvedField',
              type: 'Bar',
              resolver: (collection, args, context) => {
                return 'bar';
              },
              addOriginalField: true,
            },
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { field: String resolvedField: Bar }');
      });
      test('generate a type for a field with addOriginalField=true for at least one resolver of an array of resolveAs', () => {
        const collection = fooCollection({
          field: {
            type: String,
            optional: true,
            canRead: ['admins'],
            resolveAs: [
              {
                fieldName: 'resolvedField',
                type: 'Bar',
                resolver: () => 'bar',
                addOriginalField: true,
              },
              {
                fieldName: 'anotherResolvedField',
                type: 'Bar',
                resolver: () => 'bar',
              },
            ],
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { field: String resolvedField: Bar anotherResolvedField: Bar }');
      });
    });

    /*
    Feature removed
    generating enums from allowed values automatically => bad idea, could be a manual helper instead
    describe('enums', () => {
      test('don\'t generate enum type when some values are not allowed', () => {
        const collection = fooCollection({
          withAllowedField: {
            type: String,
            canRead: ['admins'],
            allowedValues: ['français', 'bar'] // "ç" is not accepted, Enum must be a name
          }
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { withAllowedField: String }');
        expect(normalizedSchema).not.toMatch('type Foo { withAllowedField: FooWithAllowedFieldEnum }');
        expect(normalizedSchema).not.toMatch('enum FooWithAllowedFieldEnum { français bar }');
      });
      test('fail when allowedValues are not string', () => {
        const collection = fooCollection({
          withAllowedField: {
            type: String,
            canRead: ['admins'],
            allowedValues: [0, 1] // "ç" is not accepted, Enum must be a name
          }
        });
        expect(() => collectionToGraphQL(collection)).toThrow();
      });
      test('generate enum type when allowedValues is defined and field is a string', () => {
        const collection = fooCollection({
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
      test('generate enum type for nested objects', () => {
        test('generate enum type when allowedValues is defined and field is a string', () => {
          const collection = fooCollection({
            nestedField: {
              type: new SimpleSchema({
                withAllowedField: {
                  type: String,
                  allowedValues: ['foo', 'bar'],
                  canRead: ['admins'],
                }
              }),
              canRead: ['admins'],
            }
          });
          const res = collectionToGraphQL(collection);
          expect(res.graphQLSchema).toBeDefined();
          // debug
          //console.log(res.graphQLSchema);
          const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
          expect(normalizedSchema).toMatch('type Foo { nestedField { withAllowedField: FooNestedFieldWithAllowedFieldEnum } }');
          expect(normalizedSchema).toMatch('enum FooNestedFieldWithAllowedFieldEnum { foo bar }');
        });
     
      });
     
      test('2 level of nesting', () => {
        const collection = fooCollection({
          entrepreneurLifeCycleHistory: {
            type: Array,
            optional: true,
            canRead: ['admins', 'mods'],
            //onUpdate: entLifecycleHistoryOnUpdate,
          },
          'entrepreneurLifeCycleHistory.$': {
            type: new SimpleSchema(
              {
                entrepreneurLifeCycleState: {
                  type: String,
                  // canCreate: ['admins', 'mods'],
                  canRead: ['admins', 'mods'],
                  // canUpdate: ['admins', 'mods'],
                  input: 'select',
                  options: [
                    { value: 'booster', label: 'Booster' },
                    { value: 'explorer', label: 'Explorer' },
                    { value: 'starter', label: 'Starter' },
                    { value: 'tester', label: 'Tester' },
                  ],
                  allowedValues: ['booster', 'explorer', 'starter', 'tester'],
                },
              }
            )
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('type Foo { entrepreneurLifeCycleHistory: [FooEntrepreneurLifeCycleHistory]');
        expect(normalizedSchema).toMatch('type FooEntrepreneurLifeCycleHistory { entrepreneurLifeCycleState: FooEntrepreneurLifeCycleHistoryEntrepreneurLifeCycleStateEnum');
        expect(normalizedSchema).toMatch('enum FooEntrepreneurLifeCycleHistoryEntrepreneurLifeCycleStateEnum { booster explorer starter tester }');
      });
     
      test("support enum type in array children", () => {
        throw new Error("test not written yet")
        const schema = {
          arrayField : { ... }
          "arrayField.$": {
            type: String,
            allowedValues: [...] // whatever
          } 
        }
      })
    });
    */

    describe('mutation inputs', () => {
      test('generate creation input', () => {
        const collection = fooCollection({
          field: {
            type: String,
            canRead: ['admins'],
            canCreate: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('input CreateFooInput { data: CreateFooDataInput!');
        expect(normalizedSchema).toMatch('input CreateFooDataInput { field: String }');
      });
      test('generate inputs for nested objects', () => {
        const collection = fooCollection({
          nestedField: {
            type: new SimpleSchema({
              someField: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins'],
              },
            }),
            canRead: ['admins'],
            canCreate: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        // TODO: not 100% of the expected result
        expect(normalizedSchema).toMatch('input CreateFooInput { data: CreateFooDataInput!');
        expect(normalizedSchema).toMatch('input CreateFooDataInput { nestedField: CreateFooNestedFieldDataInput }');
        expect(normalizedSchema).toMatch('input CreateFooNestedFieldDataInput { someField: String }');
      });
      test('generate inputs for array of nested objects', () => {
        const collection = fooCollection({
          arrayField: {
            type: Array,
            canRead: ['admins'],
            canCreate: ['admins'],
          },
          'arrayField.$': {
            canRead: ['admins'],
            canCreate: ['admins'],
            type: new SimpleSchema({
              someField: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins'],
              },
            }),
          },
        });
        const res = collectionToGraphQL(collection);
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        // TODO: not 100% sure of the syntax
        expect(normalizedSchema).toMatch('input CreateFooInput { data: CreateFooDataInput!');
        expect(normalizedSchema).toMatch('input CreateFooDataInput { arrayField: [CreateFooArrayFieldDataInput] }');
        expect(normalizedSchema).toMatch('input CreateFooArrayFieldDataInput { someField: String }');
      });
      test('do NOT generate new inputs for array of JSON', () => {
        const collection = fooCollection({
          arrayField: {
            type: Array,
            canRead: ['admins'],
            canCreate: ['admins'],
          },
          'arrayField.$': {
            canRead: ['admins'],
            canCreate: ['admins'],
            type: Object,
          },
        });
        const res = collectionToGraphQL(collection);
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        // TODO: not 100% sure of the syntax
        expect(normalizedSchema).toMatch('input CreateFooDataInput { arrayField: [JSON] }');
        expect(normalizedSchema).not.toMatch('CreateJSONDataInput');
      });
      test('do NOT generate new inputs for blackboxed array', () => {
        const collection = fooCollection({
          arrayField: {
            type: Array,
            canRead: ['admins'],
            canCreate: ['admins'],
            blackbox: true,
          },
          'arrayField.$': {
            canRead: ['admins'],
            canCreate: ['admins'],
            type: new SimpleSchema({
              foo: {
                type: String,
                canRead: ['admins'],
                canUpdate: ['admins'],
              },
            }),
          },
        });
        const res = collectionToGraphQL(collection);
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('input CreateFooDataInput { arrayField: [JSON] }');
        expect(normalizedSchema).not.toMatch('CreateJSONDataInput');
      });

      test('do NOT generate new inputs for nested objects if a type is provided', () => {
        const collection = fooCollection({
          nestedField: {
            type: new SimpleSchema({
              someField: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins'],
              },
            }),
            typeName: 'AlreadyRegisteredType',
            canRead: ['admins'],
            canCreate: ['admins'],
          },
        });
        const res = collectionToGraphQL(collection);
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        // TODO: not 100% of the expected result
        expect(normalizedSchema).toMatch('input CreateFooDataInput { nestedField: CreateAlreadyRegisteredTypeDataInput }');
        expect(normalizedSchema).not.toMatch('CreateFooNestedFieldDataInput');
      });
      test('do NOT generate new inputs for array of objects if typeName is provided', () => {
        const collection = fooCollection({
          arrayField: {
            type: Array,
            canRead: ['admins'],
            canCreate: ['admins'],
          },
          'arrayField.$': {
            canRead: ['admins'],
            canCreate: ['admins'],
            typeName: 'AlreadyRegisteredType',
            type: new SimpleSchema({
              someField: {
                type: String,
                canRead: ['admins'],
                canCreate: ['admins'],
              },
            }),
          },
        });
        const res = collectionToGraphQL(collection);
        // debug
        //console.log(res.graphQLSchema);
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        // TODO: not 100% sure of the syntax
        expect(normalizedSchema).toMatch('input CreateFooDataInput { arrayField: [CreateAlreadyRegisteredTypeDataInput] }');
        expect(normalizedSchema).not.toMatch('CreateFooArrayFieldDataInput');
      });

      test('ignore resolveAs', () => {
        const collection = fooCollection({
          nestedField: {
            canRead: ['admins'],
            canCreate: ['admins'],
            type: new SimpleSchema({
              someField: {
                type: String,
                optional: true,
                canRead: ['admins'],
                resolveAs: {
                  fieldName: 'resolvedField',
                  type: 'Bar',
                  resolver: (collection, args, context) => {
                    return 'bar';
                  },
                },
              },
            }),
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).not.toMatch('input CreateFooNestedFieldDataInput');
      });
      test('ignore resolveAs with addOriginalField when generating nested create input', () => {
        const collection = fooCollection({
          nestedField: {
            canRead: ['admins'],
            canCreate: ['admins'],
            type: new SimpleSchema({
              someField: {
                type: String,
                optional: true,
                canRead: ['admins'],
                canCreate: ['admins'],
                resolveAs: {
                  fieldName: 'resolvedField',
                  type: 'Bar',
                  resolver: (collection, args, context) => {
                    return 'bar';
                  },
                  addOriginalField: true,
                },
              },
            }),
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).toMatch('input CreateFooInput { data: CreateFooDataInput!');
        expect(normalizedSchema).toMatch('input CreateFooDataInput { nestedField: CreateFooNestedFieldDataInput }');
        expect(normalizedSchema).toMatch('input CreateFooNestedFieldDataInput { someField: String }');
      });

      test('do not generate generic input type for direct nested arrays or objects (only appliable to referenced types)', () => {
        // TODO: test is over complex because of a previous misunderstanding, can be simplified
        const collection = fooCollection({
          arrayField: {
            type: Array,
            optional: true,
            canRead: ['admins'],
            canCreate: ['admins'],
            canUpdate: ['admins'],
          },
          'arrayField.$': {
            type: new SimpleSchema({
              someFieldId: {
                type: String,
                optional: true,
                canRead: ['admins'],
                resolveAs: {
                  fieldName: 'someField',
                  type: 'User',
                  resolver: (collection, args, context) => {
                    return { foo: 'bar' };
                  },
                  addOriginalField: true,
                },
              },
            }),
          },
        });
        const res = collectionToGraphQL(collection);
        expect(res.graphQLSchema).toBeDefined();
        const normalizedSchema = normalizeGraphQLSchema(res.graphQLSchema);
        expect(normalizedSchema).not.toMatch('input FooArrayFieldInput');
      });
    });
  });

  describe('resolvers', () => {
    test.skip('use default resolvers if none is specified', () => {});
    test.skip('do not add default resolvers if "null" is specified', () => {});
    test.skip('use provided resolvers if any', () => {});
  });
  describe('mutations', () => {
    test.skip('use default resolvers if none is specified', () => {});
    test.skip('do not add default resolvers if "null" is specified', () => {});
    test.skip('use provided resolvers if any', () => {});
  });
});
