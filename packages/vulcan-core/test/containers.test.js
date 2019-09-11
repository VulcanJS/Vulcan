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
import {
  singleQuery
} from '../lib/modules/containers/withSingle';

import { mount } from 'enzyme';

import wait from 'waait';

import { MockedProvider } from 'meteor/vulcan:test';


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
    const typeName = 'Foo';
    const Foo = {
      options: {
        collectionName: 'Foos',
        typeName
      }
    };
    const fragmentName = 'FoosDefaultFragment';
    const fragment = {
      definitions: [{
        name: {
          value: fragmentName
        }
      }],
      toString: () => `fragment FoosDefaultFragment on Foo { 
        id
        hello
        __typename
      }`
    };
    const foo = { id: 1, hello: 'world', __typename: 'Foo' };
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
        const mock = {
          request: {
            query: singleQuery({ typeName, fragmentName, fragment }),
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
          <MockedProvider removeTypename mocks={mocks} >
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
      test('send new request if props are updated', async () => {
        const query = singleQuery({ typeName, fragmentName, fragment });
        const firstRequest = {
          request: {
            query,
            variables: {
              // variables must absolutely match with the emitted request,
              // including undefined values
              'input': { 'selector': { documentId: undefined, slug: undefined, }, 'enableCache': false }
            }
          },
          result: {
            data: {
              foo: { result: null, __typename: 'Foo' }
            },
          },
        };
        const documentIdRequest = {
          request: {
            query,
            variables: {
              input: { selector: { documentId: '42', slug: undefined }, 'enableCache': false }
            }
          },
          result: {
            data: {
              foo: { result: foo, __typename: 'Foo' }
            }
          }
        };
        const mocks = [
          firstRequest,
          documentIdRequest
        ]; // need multiple mocks, one per query
        const SingleComponent = withSingle({
          collection: Foo,
          pollInterval: 0, // disable polling otherwise it will fail (we need 1 mock per request)
          fragment
        })(TestComponent);
        const wrapper = mount(
          <MockedProvider mocks={mocks} >
            <SingleComponent />
          </MockedProvider>
        );
        // @see https://www.apollographql.com/docs/react/recipes/testing/#testing-final-state
        //await new Promise(resolve => setTimeout(resolve));
        await wait(0);
        wrapper.update(); // rerender
        const intermediateRes = wrapper.find(TestComponent).first();
        expect(intermediateRes.prop('loading')).toBe(false);
        expect(intermediateRes.prop('data').error).toBeFalsy();
        expect(intermediateRes.prop('document')).toEqual(null);
        // change props (MockedProvider will pass childProps down)
        wrapper.setProps({ childProps: { documentId: '42' } });
        await wait(0);
        wrapper.update();
        const finalRes = wrapper.find(TestComponent).first();
        expect(finalRes.prop('loading')).toBe(false);
        expect(finalRes.prop('data').error).toBeFalsy();
        expect(finalRes.prop('document')).toEqual(foo);

      });
      test.skip('work if fragment is not yet defined', () => {
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
