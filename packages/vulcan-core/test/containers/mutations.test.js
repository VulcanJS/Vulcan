import React from 'react';
import {
    withCreate,
    withUpdate,
    withUpsert,
    withMutation
} from '../../lib/modules';
import { MockedProvider } from 'meteor/vulcan:test';
import wait from 'waait';
import { mount } from 'enzyme';
import expect from 'expect';
import gql from 'graphql-tag';

const test = it;

describe('vulcan:core/container/mutations', () => {
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
    describe('withCreate', () => {
        const TestComponent = () => 'test';
        const rawFoo = { hello: 'world' };
        const defaultOptions = {
            collection: Foo,
            fragmentName: fragmentName,
            fragment
        };
        // NOT passing for no reason...
        // @see https://github.com/apollographql/react-apollo/issues/3478
        test.skip('run a create mutation', async () => {
            const CreateComponent = withCreate(defaultOptions)(TestComponent);
            const responses = [{
                request: {
                    query: gql`
                    mutation createFoo($data: CreateFooDataInput!) {
                      createFoo(data: $data) {
                        data {
                          ...FoosDefaultFragment
                          __typename
                        }
                        __typename
                      }
                    }

                    fragment FoosDefaultFragment on Foo {
                      id
                      hello
                      __typename
                    }
                    `,
                    variables: {
                        data: rawFoo
                    }
                },
                result: {
                    createFoo: {
                        data: foo
                    },
                }
            }];
            const wrapper = mount(
                <MockedProvider mocks={responses}>
                    <CreateComponent />
                </MockedProvider>
            );
            // trigger the query
            expect(wrapper.find(TestComponent).prop('createFoo')).toBeInstanceOf(Function);
            const res = await wrapper.find(TestComponent).prop('createFoo')({
                data: rawFoo
            });
            expect(res).toEqual(foo);
        });
    });

});