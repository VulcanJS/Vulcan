import expect from 'expect';

import { GraphQLSchema } from '../../lib/modules/graphql';
import initGraphQL from '../../lib/server/apollo-server/initGraphQL';

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
});
