import expect from 'expect';

import { GraphQLSchema } from '../../lib/modules/graphql';
import initGraphQL from '../../lib/server/apollo-server/initGraphQL';

//import collectionToGraphQL from '../../lib/modules/graphql/collectionToSchema';
import { getGraphQLType } from '../../lib/modules/graphql/schemaFields';
import SimpleSchema from 'simpl-schema';
test = it;

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



  describe('schemaFields', () => {
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
      const type = getGraphQLType({schema, fieldName:'nestedField', typeName: 'Foo'});
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
      const type = getGraphQLType({schema, fieldName:'nestedField', typeName:'Foo'});
      expect(type).toBe('JSON');
    });
  });
});
