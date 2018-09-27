import expect from 'jest';
import {
  registerDefault,
  getDefaults,
  registerMutation,
  getMutations,
  getResolvers,
  createStateLink,
  createApolloClient
} from '../../lib/client/main.js';
if (Meteor.isClient) {
  describe('vulcan-lib/apolloClient', function() {
    describe('apollo-state-link', () => {
      it('register and retrieve a mutation', function() {
        const dummyMutation = () => {};
        registerMutation({
          name: 'dummyMutation',
          mutation: dummyMutation
        });
        const mutations = getMutations();
        expect(mutations['dummyMutation']).toEqual(dummyMutation);
      });
      it('register and retrieve a default value', function() {
        const dummyDefault = () => {};
        registerDefault({
          name: 'dummyDefault',
          defaultValue: dummyDefault
        });
        const defaults = getDefaults();
        expect(defaults['dummyDefault']).toEqual(dummyDefault);
      });
      it('register mutation and get resolvers', function() {
        const dummyMutation = () => {};
        registerMutation({
          name: 'dummyMutation',
          mutation: dummyMutation
        });
        const resolvers = getResolvers();
        expect(resolvers.Mutation['dummyMutation']).toEqual(dummyMutation);
      });
      it('create a stateLink', () => {
        const stateLink = createStateLink();
        expect(stateLink).toBeDefined();
      });
    });
    describe('apollo-client', function() {
      it('create a client', function() {
        const apolloClient = createApolloClient();
        expect(apolloClient).toBeDefined();
      });
    });
  });
}
