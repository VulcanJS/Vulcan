import expect from 'expect';
import sinon from 'sinon/pkg/sinon.js';

import { createMutator } from '../../lib/server/mutators';
//import StubCollections from 'meteor/hwillson:stub-collections';
import Users from 'meteor/vulcan:users';

const test = it; // TODO: just before we switch to jest

// stub collection
import {
  getDefaultResolvers,
  getDefaultMutations,
  addCallback,
  removeAllCallbacks, createCollection,
} from 'meteor/vulcan:core';
import {
  isoCreateCollection,
  initServerTest
} from 'meteor/vulcan:test';

const createDummyCollection = (typeName, schema) =>
  createCollection({
    collectionName: typeName + 's',
    typeName,
    schema,
    resolvers: getDefaultResolvers(typeName + 's'),
    mutations: getDefaultMutations(typeName + 's'),
  });
const foo2Schema = {
  _id: {
    type: String,
    canRead: ['guests'],
    optional: true,
  },
  foo2: {
    type: String,
    canCreate: ['guests'],
    canRead: ['guests'],
    canUpdate: ['guests'],
  },
};
let Foo2s = createDummyCollection('Foo2', foo2Schema);

describe('vulcan:lib/mutators', function () {

  let defaultParams;
  /*Foo2s = await isoCreateCollection({
    collectionName: 'Foo2s',
    typeName: 'Foo2',
    schema: {
      _id: {
        type: String,
        canRead: ['guests'],
        optional: true,
      },
      foo: {
        type: String,
        canCreate: ['guests'],
        canRead: ['guests'],
        canUpdate: ['guests'],
      },
    },
    resolvers: getDefaultResolvers('Foo2s'),
    mutations: getDefaultMutations('Foo2s'),
  });*/
  beforeEach(function () {
    removeAllCallbacks('foo2.create.after');
    removeAllCallbacks('foo2.create.before');
    removeAllCallbacks('foo2.create.async');
    defaultParams = {
      collection: Foo2s,
      document: { foo2: 'bar' },
      currentUser: null,
      validate: () => true,
      context: {
        Users
      }
    };
  });

  test('should run createMutator', async function () {
    const { data: resultDocument } = await createMutator(defaultParams);
    expect(resultDocument).toBeDefined();
  });
  // before
  test.skip('run before callback before document is saved', function () {
    // TODO get the document in the database
  });
  //after
  test('run after callback  before document is returned', async function () {
    const afterSpy = sinon.spy();
    addCallback('foo2.create.after', (document) => {
      afterSpy();
      document.after = true;
      return document;
    });
    const { data: resultDocument } = await createMutator(defaultParams);
    expect(afterSpy.calledOnce).toBe(true);
    expect(resultDocument.after).toBe(true);
  });
  // async
  test('run async callback', async function () {
    // TODO need a sinon stub
    const asyncSpy = sinon.spy();
    addCallback('foo2.create.async', (properties) => {
      asyncSpy(properties);
      // TODO need a sinon stub
      //expect(originalData.after).toBeUndefined()
    });
    const { data: resultDocument } = await createMutator(defaultParams);
    expect(asyncSpy.calledOnce).toBe(true);
  });
  test.skip('provide initial data to async callbacks', async function () {
    const asyncSpy = sinon.spy();
    addCallback('foo2.create.after', (document) => {
      document.after = true;
      return document;
    });
    addCallback('foo2.create.async', (properties) => {
      asyncSpy(properties);
      // TODO need a sinon stub
      //expect(originalData.after).toBeUndefined()
    });
    const { data: resultDocument } = await createMutator(defaultParams);
    expect(asyncSpy.calledOnce).toBe(true);
    // TODO: check result
  });

});
