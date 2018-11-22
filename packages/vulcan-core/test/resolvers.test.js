import expect from 'expect';
import { getDefaultResolvers } from '../lib/modules/default_resolvers';

describe('vulcan:core/default_resolvers', function() {
  const resolversOptions = {
    typeName: 'Dummy',
    collectionName: 'Dummies',
    options: {}
  };
  describe('single', function() {
    it('defines the correct fields', function() {
      const { single } = getDefaultResolvers(resolversOptions);
      const { description, resolver } = single;
      expect(description).toBeDefined();
      expect(resolver).toBeDefined();
      expect(resolver).toBeInstanceOf(Function);
    });
    const buildContext = ({ load = () => null, currentUser = null }) => ({
      Dummies: {
        options: { collectionName: 'Dummies' },
        loader: { load }
        //findOne() {
        //  console.log('FINDE_ONE');
        //}
      }, //TODO fake collection
      Users: {
        restrictViewableFields: (currentUser, collection, doc) => doc
      },
      currentUser
    });
    // TODO: what's the name of this argument? handles cache
    const lastArg = { cacheControl: {} };
    const loggedInUser = { _id: 'foobar', groups: [], isAdmin: false };
    const adminUser = { _id: 'foobar', groups: [], isAdmin: true };
    const getSingleResolver = () => getDefaultResolvers(resolversOptions).single.resolver;

    // TODO: the current behaviour is not consistent, could be improved
    // @see https://github.com/VulcanJS/Vulcan/issues/2118
    it.skip('return null if documentId is undefined', function() {
      const resolver = getSingleResolver();
      // no documentId
      const input = { selector: {} };
      // non empty db
      const context = buildContext({ load: () => ({ _id: 'my-document' }) });
      const res = resolver(null, { input }, context, lastArg);
      return expect(res).resolves.toEqual({ result: null });
    });
    it('return document in case of success', function() {
      const resolver = getSingleResolver();
      const documentId = 'my-document';
      const document = { _id: documentId };
      const input = { selector: { documentId } };
      // non empty db
      const context = buildContext({
        load: () => {
          return document;
        }
      });
      const res = resolver(null, { input }, context, lastArg);
      return expect(res).resolves.toEqual({ result: document });
    });
    it('return null if failure to find doc but allowNull is true', function() {
      const resolver = getSingleResolver();
      const documentId = 'bad-document';
      const input = { selector: { documentId }, allowNull: true };
      // empty db
      const context = buildContext({ load: () => null });
      const res = resolver(null, { input }, context, lastArg);
      return expect(res).resolves.toEqual({ result: null });
    });
    it('throws if documentId is defined but does not match any document', function() {
      const resolver = getSingleResolver();
      const documentId = 'bad-document';
      const document = { _id: documentId };
      const input = { selector: { documentId } };
      // empty db
      const context = buildContext({ load: () => null });
      return expect(resolver(null, { input }, context, lastArg)).rejects.toThrow();
    });
  });
});
