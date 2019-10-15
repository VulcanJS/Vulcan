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
import {
  addToSet,
} from '../../lib/client/apollo-client/updates'

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

  describe('updates for watched mutations', () => {
    test('addToSet', () => {
      const queryData = { results: [], totalCount: 0 }
      const document = { _id: "foobar" }
      const res = addToSet(queryData, document)
      // reference should not be the same
      expect(res.results === queryData.results).not.toBe(true)
      expect(res.results).toHaveLength(1)
      expect(res.results[0]).toEqual(document)
      expect(res.totalCount).toEqual(1)
    })

  })
});
