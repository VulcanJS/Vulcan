import { multiQueryUpdater } from '../../lib/modules/containers/create2';
import { createDummyCollection } from 'meteor/vulcan:test';
import expect from 'expect';
import sinon from 'sinon';

const test = it;

describe('vulcan:core/container/mutations2', () => {
  const typeName = 'Foo';
  const Foo = createDummyCollection({
    options: {
      collectionName: 'Foos',
      typeName,
      multiResolverName: 'foos',
    },
    schema: { val: { type: Number, canRead: ['guests'] } },
  });
  const fragmentName = 'FoosDefaultFragment';
  const fragment = {
    definitions: [
      {
        name: {
          value: fragmentName,
        },
      },
    ],
    toString: () => `fragment FoosDefaultFragment on Foo { 
        _id
        hello
        __typename
      }`,
  };

  const foo = { _id: 1, hello: 'world', __typename: 'Foo' };

  describe('multiQuery update after mutations', () => {
    describe('update after a document creation', () => {
      const defaultOptions = {
        typeName,
        fragment,
        fragmentName,
        collection: Foo,
      };
      const defaultCacheContent = {
        foos: {
          results: [],
          totalCount: 0,
        },
      };
      const makeCacheData = (vars = { input: { filter: {} } }) => ({
        data: {
          ROOT_QUERY: {
            // variables are contained in the query name
            [`foos(${JSON.stringify(vars)})`]: {},
          },
        },
      });
      const defaultCacheData = makeCacheData({});

      beforeEach(() => {
        Foo.getParameters = terms => ({
          selector: {},
          options: {},
        });
      });

      test('add document to multi query after a creation', async () => {
        const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' });
        const cache = {
          readQuery: () => defaultCacheContent,
          //writeQuery, // we write to the client instead
          data: defaultCacheData,
        };
        const updates = await update(cache, {
          data: {
            createFoo: {
              data: foo,
            },
          },
        });
        expect(updates).toHaveLength(1);
        expect(updates[0].data).toEqual({
          foos: { results: [foo], totalCount: 1 },
        });
      });
      test('update document if already there', async () => {
        const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' });

        const cache = {
          readQuery: () => ({
            ...defaultCacheContent,
            foos: {
              results: [foo],
              totalCount: 1,
            },
          }),
          data: defaultCacheData,
        };
        const updateFoo = { ...foo, UPDATED: true };
        const updates = await update(cache, {
          data: {
            createFoo: {
              data: updateFoo,
            },
          },
        });
        expect(updates).toHaveLength(1);
        expect(updates[0].data).toMatchObject({
          foos: { results: [updateFoo], totalCount: 1 },
        });
      });
      test('do not add document if it does not match the mongo selector of the query', async () => {
        const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' });

        const cache = {
          readQuery: () => defaultCacheContent,
          data: makeCacheData({
            input: {
              filter: { val: { _gt: 42 } },
            },
          }),
        };
        const newFoo = { ...foo, val: 41 };
        const updates = await update(cache, {
          data: {
            createFoo: {
              data: newFoo,
            },
          },
        });
        expect(updates).toHaveLength(0);
      });
      test('add document if it does match the mongo selector', async () => {
        const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' });

        const cache = {
          readQuery: () => defaultCacheContent,
          data: makeCacheData({
            input: {
              filter: { val: { _gt: 42 } },
            },
          }),
        };
        const newFoo = { ...foo, val: 46 };
        const updates = await update(cache, {
          data: {
            createFoo: {
              data: newFoo,
            },
          },
        });
        expect(updates).toHaveLength(1);
      });
      test('sort documents', async () => {
        const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' });

        const cache = {
          readQuery: () => ({
            foos: {
              results: [{ val: 40 }, { val: 43 }],
              totalCount: 2,
            },
          }),
          data: makeCacheData({
            input: {
              sort: {
                val: 'asc',
              },
            },
          }),
        };
        const newFoo = { ...foo, val: 42 };
        const updates = await update(cache, {
          data: {
            createFoo: {
              data: newFoo,
            },
          },
        });
        expect(updates).toHaveLength(1);
        expect(updates[0].data.foos.results).toHaveLength(3);
        expect(updates[0].data.foos.results[1]).toEqual(newFoo);
      });
    });
  });
});
