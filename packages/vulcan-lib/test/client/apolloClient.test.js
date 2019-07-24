import expect from 'expect';
import {
  registerStateLinkDefault,
  getStateLinkDefaults,
  registerStateLinkMutation,
  getStateLinkMutations,
  getStateLinkResolvers,
  createStateLink,
  createApolloClient,
} from '../../lib/client/main.js';
if (Meteor.isClient) {
  describe('vulcan-lib/apolloClient', function () {
    describe('apollo-state-link', () => {
      it('registerStateLink and retrieve a mutation', function () {
        const dummyMutation = () => { };
        registerStateLinkMutation({
          name: 'dummyMutation',
          mutation: dummyMutation,
        });
        const mutations = getStateLinkMutations();
        expect(mutations['dummyMutation']).toEqual(dummyMutation);
      });
      it('register and retrieve a default value', function () {
        const dummyDefault = () => { };
        registerStateLinkDefault({
          name: 'dummyDefault',
          defaultValue: dummyDefault,
        });
        const defaults = getStateLinkDefaults();
        expect(defaults['dummyDefault']).toEqual(dummyDefault);
      });
      it('register mutation and get resolvers', function () {
        const dummyMutation = () => { };
        registerStateLinkMutation({
          name: 'dummyMutation',
          mutation: dummyMutation,
        });
        const resolvers = getStateLinkResolvers();
        expect(resolvers.Mutation['dummyMutation']).toEqual(dummyMutation);
      });
      it('create a stateLink', () => {
        const stateLink = createStateLink({});
        expect(stateLink).toBeDefined();
      });
    });
    describe('apollo-client', function () {
      it.skip('create a client', function () {
        const apolloClient = createApolloClient();
        expect(apolloClient).toBeDefined();
      });
    });
  });
}
