import React from 'react';
import {
  withCreate2,
  withUpdate2,
  withUpsert2,
  withDelete2,
  withMutation,
  useCreate2,
  useUpdate2,
  useUpsert2,
  useDelete2,
} from '../../lib/modules';
import { /* multiQueryUpdater*/ buildCreateQuery } from '../../lib/modules/containers/create2';
import { buildUpdateQuery } from '../../lib/modules/containers/update2';
import { buildUpsertQuery } from '../../lib/modules/containers/upsert2';
import { buildDeleteQuery } from '../../lib/modules/containers/delete2';
import { MockedProvider, createDummyCollection } from 'meteor/vulcan:test';
import { OperationNameMockLink } from 'operation-name-mock-link';
import { mount } from 'enzyme';
import expect from 'expect';
// import gql from 'graphql-tag';

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

  const rawFoo = { hello: 'world' };
  const fooUpdate = { _id: 1, hello: 'world' };
  const foo = { _id: 1, hello: 'world', __typename: 'Foo' };
  const TestComponent = () => 'test';
  const defaultOptions = {
    collection: Foo,
    fragmentName: fragmentName,
    fragment,
  };
  describe('common', () => {
    test('export hooks and hocs', () => {
      expect(useCreate2).toBeInstanceOf(Function);
      expect(useUpdate2).toBeInstanceOf(Function);
      expect(useUpsert2).toBeInstanceOf(Function);
      expect(useDelete2).toBeInstanceOf(Function);
      expect(withCreate2).toBeInstanceOf(Function);
      expect(withUpdate2).toBeInstanceOf(Function);
      expect(withUpsert2).toBeInstanceOf(Function);
      expect(withDelete2).toBeInstanceOf(Function);
    });
    test('pass down props', () => {
      const CreateComponent = withCreate2(defaultOptions)(TestComponent);
      const UpdateComponent = withUpdate2(defaultOptions)(TestComponent);
      const UpsertComponent = withUpsert2(defaultOptions)(TestComponent);
      const DeleteComponent = withDelete2(defaultOptions)(TestComponent);
      [CreateComponent, UpdateComponent, UpsertComponent, DeleteComponent].forEach(C => {
        const wrapper = mount(
          <MockedProvider mocks={[]}>
            <C foo="bar" />
          </MockedProvider>
        );
        expect({
          res: wrapper.find('TestComponent').prop('foo'),
          C: C.displayName,
        }).toEqual({ res: 'bar', C: C.displayName });
      });
    });
  });

  describe('create', () => {
    test('run a create mutation', async () => {
      const CreateComponent = withCreate2(defaultOptions)(TestComponent);
      const responses = [
        {
          request: {
            operationName: 'createFoo',
            query: buildCreateQuery({ fragmentName, fragment, typeName }),
            // For matching using MockedProvider, we need the exact variables
            // Instead we use a more flexible mock link based on operation name
            //   variables: {
            //     data: rawFoo,
          },
          result: {
            data: {
              createFoo: {
                data: foo,
                __typename: 'Foo',
              },
            },
          },
        },
      ];
      const wrapper = mount(
        <MockedProvider /*mocks={responses}*/ link={new OperationNameMockLink(responses, false)}>
          <CreateComponent />
        </MockedProvider>
      );
      // trigger the query
      expect(wrapper.find(TestComponent).prop('createFoo')).toBeInstanceOf(Function);
      const res = await wrapper.find(TestComponent).prop('createFoo')({
        data: rawFoo,
      });
      expect(res).toMatchObject({ data: { createFoo: { data: foo, __typename: 'Foo' } } });
    });
  });

  describe('update', () => {
    test('run update mutation', async () => {
      const UpdateComponent = withUpdate2(defaultOptions)(TestComponent);
      const responses = [
        {
          request: {
            query: buildUpdateQuery({ typeName, fragmentName, fragment }),
            operationName: 'updateFoo',
            //variables: {
            //  //selector: { documentId: foo._id },
            //  data: fooUpdate,
            //  input: {},
            //},
          },
          result: {
            data: {
              updateFoo: {
                data: foo,
                __typename: 'Foo',
              },
            },
          },
        },
      ];
      const wrapper = mount(
        <MockedProvider /*mocks={responses}*/ link={new OperationNameMockLink(responses, false)}>
          <UpdateComponent />
        </MockedProvider>
      );
      expect(wrapper.find(TestComponent).prop('updateFoo')).toBeInstanceOf(Function);
      const res = await wrapper.find(TestComponent).prop('updateFoo')({
        data: fooUpdate,
      });
      expect(res).toEqual({ data: { updateFoo: { data: foo, __typename: 'Foo' } } });
    });
  });
  describe('upsert', () => {
    test('run upsert mutation', async () => {
      const UpsertComponent = withUpsert2(defaultOptions)(TestComponent);
      const responses = [
        {
          request: {
            query: buildUpsertQuery({ typeName, fragmentName, fragment }),
            operationName: 'upsertFoo',
            // variables: {
            //   data: fooUpdate,
            //   input: {},
            // },
          },
          result: {
            data: {
              upsertFoo: {
                data: foo,
                __typename: 'Foo',
              },
            },
          },
        },
      ];
      const wrapper = mount(
        <MockedProvider /*mocks={responses}*/ link={new OperationNameMockLink(responses, false)}>
          <UpsertComponent />
        </MockedProvider>
      );
      expect(wrapper.find(TestComponent).prop('upsertFoo')).toBeInstanceOf(Function);
      const res = await wrapper.find(TestComponent).prop('upsertFoo')({
        data: fooUpdate,
      });
      expect(res).toEqual({ data: { upsertFoo: { data: foo, __typename: 'Foo' } } });
    });
  });
  describe('delete', () => {
    test('run delete mutations', async () => {
      const DeleteComponent = withDelete2(defaultOptions)(TestComponent);
      const responses = [
        {
          request: {
            operationName: 'deleteFoo',
            query: buildDeleteQuery({ typeName, fragment, fragmentName }),
            // variables: {
            //   input: {
            //     _id: '42',
            //   },
            // },
          },
          result: {
            data: {
              deleteFoo: {
                data: foo,
                __typename: 'Foo',
              },
            },
          },
        },
      ];
      const wrapper = mount(
        <MockedProvider /*mocks={responses}*/ link={new OperationNameMockLink(responses, false)}>
          <DeleteComponent />
        </MockedProvider>
      );
      expect(wrapper.find(TestComponent).prop('deleteFoo')).toBeInstanceOf(Function);
      const res = await wrapper.find(TestComponent).prop('deleteFoo')({
        input: {
          _id: '42',
        },
      });
      expect(res).toEqual({ data: { deleteFoo: { data: foo, __typename: 'Foo' } } });
    });
  });

  describe('custom mutation', () => {
    test('return a component even if fragment is not yet registered', () => {
      const MutationComponent = withMutation({ name: 'whatever', fragmentName: 'foobar' })(TestComponent);
      expect(MutationComponent).toBeInstanceOf(Function);
    });
  });
});
