import React from 'react';
import expect from 'expect';
import { shallow, mount } from 'enzyme';
//import gql from 'graphql-tag';
import { initComponentTest } from 'meteor/vulcan:test';
import {
  withSingle,
  withMulti,
} from '../../lib/modules';
import {
  singleQuery
} from '../../lib/modules/containers/withSingle';
import {
  multiQuery
} from '../../lib/modules/containers/withMulti';


import wait from 'waait';

import { MockedProvider } from 'meteor/vulcan:test';


const test = it;

// we must import all the other components, so that "registerComponent" is called
import '../../lib/modules';
// setup Vulcan (load components, initialize fragments)
initComponentTest();

describe('vulcan:core/queries', function () {
  const typeName = 'Foo';
  const Foo = {
    options: {
      collectionName: 'Foos',
      typeName,
      multiResolverName: 'foos'
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
  const TestComponent = (props) => {
    return <div>test</div>;
  };

  describe('withSingle', () => {
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
    const defaultQuery = multiQuery({
      fragment,
      typeName,
      fragmentName
    });
    const defaultVariables = {
      'input': {
        'terms': {
          'limit': 10,
          'itemsPerPage': 10
        },
        'enableCache': false,
        'enableTotal': true
      }
    };
    const defaultOptions = {
      collection: Foo,
      fragment,
      pollInterval: 0,
      notifyOnNetworkStatusChange: true // necessary for loadMoreInc
    };
    test('returns a graphql component', () => {
      const wrapper = withMulti(defaultOptions);
      expect(wrapper).toBeDefined();
      expect(wrapper).toBeInstanceOf(Function);
    });
    test('query multiple documents', async () => {

      const response = {
        request: {
          query: defaultQuery,
          variables: defaultVariables
        },
        result: {
          data: {
            foos: {
              results: [foo],
              totalCount: 10,
              __typename: '[Foo]'
            },
          }
        }
      };
      const mocks = [response];
      const MultiComponent = withMulti({
        collection: Foo,
        fragment,
        pollInterval: 0,
      })(TestComponent);

      const wrapper = mount(
        <MockedProvider mocks={mocks}>
          <MultiComponent
            terms={{}}
          />
        </MockedProvider>
      );
      const loadingRes = wrapper.find(TestComponent);
      expect(loadingRes.prop('loading')).toEqual(true);
      expect(loadingRes.prop('error')).toBeFalsy();
      // pass loading
      await wait(0);
      wrapper.update();
      const finalRes = wrapper.find(TestComponent);
      expect(finalRes.prop('loading')).toEqual(false);
      expect(finalRes.prop('error')).toBeFalsy();
      expect(finalRes.prop('results')).toEqual([foo]);
      expect(finalRes.prop('count')).toEqual(1);
    });

    test.skip('add pagination terms', () => {

    });

    test('load more increase the limit', async () => {
      // @see https://stackoverflow.com/questions/49064334/invoke-a-function-with-enzyme-when-function-is-passed-down-as-prop-react
      const responses = [
        // first request
        {
          request: {
            query: defaultQuery,
            variables: {
              input: {
                ...defaultVariables.input,
                terms: {
                  limit: 1,
                  itemsPerPage: 1 // = first limit
                }
              }
            }
          },
          result: {
            data: {
              foos: {
                results: [foo],
                totalCount: 10,
                __typename: '[Foo]'
              }
            }
          }
        },
        // calling loadMore / loadMoreInc will send new requests with updated terms
        // loadMore
        {
          request: {
            query: defaultQuery,
            variables: {
              input: {
                ...defaultVariables.input,
                terms: {
                  limit: 2, // limit is increased by load more
                  itemsPerPage: 1
                }
              }
            }
          },
          result: {
            data: {
              foos: {
                results: [foo, foo, foo],
                totalCount: 10,
                __typename: '[Foo]'
              }
            }
          }
        },
      ];

      const MultiComponent = withMulti(defaultOptions)(TestComponent);

      const wrapper = mount(
        <MockedProvider mocks={responses}>
          <MultiComponent terms={{ limit: 1 }} />
        </MockedProvider>
      );
      // get data
      await wait(0);
      wrapper.update();

      // call load more
      expect(wrapper.find(TestComponent).prop('loadMore')).toBeInstanceOf(Function);
      wrapper.find(TestComponent).prop('loadMore')();
      await wait(0);
      wrapper.update();
      const loadMoreRes = wrapper.find(TestComponent);
      expect(loadMoreRes.prop('error')).toBeFalsy();
      expect(loadMoreRes.prop('results')).toHaveLength(3);
    });

    // TODO: not passing, is this expected?
    test('loadMoreInc get more data', async () => {
      // @see https://stackoverflow.com/questions/49064334/invoke-a-function-with-enzyme-when-function-is-passed-down-as-prop-react
      const responses = [
        // first request
        {
          request: {
            query: defaultQuery,
            variables: {
              input: {
                ...defaultVariables.input,
                terms: {
                  limit: 1,
                  itemsPerPage: 1 // = first limit
                }
              }
            }
          },
          result: {
            data: {
              foos: {
                results: [foo],
                totalCount: 10,
                __typename: '[Foo]'
              }
            }
          }
        },
        // loadmoreInc
        {
          request: {
            query: defaultQuery,
            variables: {
              // get an offset to load only relevant data
              input: { terms: { limit: 1, itemsPerPage: 1, offset: 1 } }
            }
          },
          result: {
            data: {
              foos: {
                results: [foo],
                totalCount: 10,
                __typename: '[Foo]'
              }
            }
          }
        }
      ];

      const MultiComponent = withMulti(defaultOptions)(TestComponent);

      const wrapper = mount(
        <MockedProvider mocks={responses}>
          <MultiComponent terms={{ limit: 1 }} />
        </MockedProvider>
      );
      console.log(wrapper.find(TestComponent).prop('loading'));
      console.log(wrapper.find(TestComponent).prop('loadingInitial'));
      console.log(wrapper.find(TestComponent).prop('loadingMore'));
      // get data
      await wait(0);
      wrapper.update();
      // call load more incremental
      // TODO: weird behaviour
      expect(wrapper.find(TestComponent).prop('loadMoreInc')).toBeInstanceOf(Function);
      wrapper.find(TestComponent).prop('loadMoreInc')();
      console.log(wrapper.find(TestComponent).prop('loading'));
      console.log(wrapper.find(TestComponent).prop('loadingInitial'));
      console.log(wrapper.find(TestComponent).prop('loadingMore'));
      await wait(0);
      wrapper.update();
      const loadMoreIncRes = wrapper.find(TestComponent);
      expect(loadMoreIncRes.prop('error')).toBeFalsy();
      expect(loadMoreIncRes.prop('results')).toHaveLength(2);

    });
  });
});
