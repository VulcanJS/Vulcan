import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { Components } from 'meteor/vulcan:core';
import { initComponentTest } from 'meteor/vulcan:test';
import {
  withComponents,
  withSingle,
  withMulti,
  withCreate,
  withDelete,
  withUpdate,
  withUpsert,
  withMutation,
  withCurrentUser,
  withSideData,
  withAccess,
} from '../lib/modules';

import { mount } from 'enzyme';

import wait from 'waait';

// in react-apollo v3, this will be imported from the independant package "@apollo/react-testing" instead
// currently we use v2
import { MockedProvider } from 'react-apollo/test-utils';
import gql from 'graphql-tag';


const test = it;

// we must import all the other components, so that "registerComponent" is called
import '../lib/modules';
// setup Vulcan (load components, initialize fragments)
initComponentTest();

describe('vulcan-core/containers', function () {
  describe('withComponents', function () {
    it('should override components', function () {
      // replace any component for testing purpose
      const firstComponentName = Components[Object.keys(Components)[0]];
      const FooComponent = () => 'FOO';
      const components = { [firstComponentName]: FooComponent };
      const MyComponent = withComponents(({ Components }) => Components[firstComponentName]());
      const wrapper = shallow(<MyComponent components={components} />);
      expect(wrapper.prop('Components')).toBeDefined();
      expect(wrapper.prop('Components')[firstComponentName]).toEqual(FooComponent);
      expect(wrapper.html()).toEqual('FOO');
    });
  });
  describe('withMessages', function () {
    const WrappedComponent = props => <div />;
    const apolloClient = null; // TODO: init an apolloClient, that must be available in the context
    it.skip('pass messages', function () { });
    it.skip('add a flash message', function () { });
    it.skip('mark a flash message as seen', function () { });
    it.skip('hide a flash message as seen', function () { });
    it.skip('clear seen', function () { });
  });

  describe('queries', () => {
    const Foo = {
      options: {
        collectionName: 'Foos',
        typeName: 'Foo'
      }
    };
    const fragment = {
      definitions: [{
        name: {
          value: 'FoosDefaultFragment'
        }
      }],
      toString: () => `fragment FoosDefaultFragment on Foo { 
        id
        hello
      }`
    };
    describe('withSingle', () => {
      const TestComponent = (props) => {
        return <div>test</div>;
      };
      test('returns a graphql component', () => {
        const wrapper = withSingle({
          collection: Foo,
          fragment
        });
        expect(wrapper).toBeDefined();
        expect(wrapper).toBeInstanceOf(Function);
      });
      test('query single document', async () => {

        const foo = { id: 1, hello: 'world' };
        // The component AND the query need to be exported

        const mock = {
          request: {
            // TODO: withSingle should export a function that generate this query
            query: gql`
              query singleFooQuery($input: SingleFooInput) {
                foo(input: $input) {
                  result {
                    ...FoosDefaultFragment
                  }
                  __typename
                }
              }

              fragment FoosDefaultFragment on Foo {
                id
                hello
              }
              `,
            variables: {
              // variables must absolutely match with the emitted request,
              // including undefined values
              'input': { 'selector': { documentId: undefined, slug: undefined, }, 'enableCache': false }
            }
          },
          result: {
            data: {
              foo: { result: foo, __typename: 'Foo' }
            },
          },
        };
        const mocks = [
          mock,
        ]; // need multiple mocks, one per query
        const SingleComponent = withSingle({
          collection: Foo,
          pollInterval: 0, // disable polling otherwise it will fail (we need 1 mock per request)
          fragment
        })(TestComponent);
        const wrapper = mount(
          <MockedProvider removeTypename mocks={mocks} addTypename={false} >
            <SingleComponent />
          </MockedProvider>
        );

        const loadingRes = wrapper.find(TestComponent).first();
        expect(loadingRes.prop('loading')).toBe(true);
        // @see https://www.apollographql.com/docs/react/recipes/testing/#testing-final-state
        //await new Promise(resolve => setTimeout(resolve));
        await wait(0);
        wrapper.update(); // rerender

        const finalRes = wrapper.find(TestComponent).first();
        expect(finalRes.prop('loading')).toBe(false);
        expect(finalRes.prop('data').error).toBeFalsy();
        expect(finalRes.prop('document')).toEqual(foo);
      });
      test('work if fragment is not yet defined', () => {
        const hoc = withSingle({
          collection: Foo,
          fragmentName: 'NotRegisteredYetFragment'
        });
        expect(hoc).toBeDefined();
        expect(hoc).toBeInstanceOf(Function);
      });
    });
    describe('withMulti', () => {
      test('returns a graphql component', () => {
        const wrapper = withMulti({
          collection: Foo,
          fragment
        });
        expect(wrapper).toBeDefined();
        expect(wrapper).toBeInstanceOf(Function);
      });
    });
  });
  describe('mutations', () => {

  });
});
