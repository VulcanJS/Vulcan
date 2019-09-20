import React from 'react';
import {
    withCreate,
    withUpdate,
    withUpsert,
    withDelete,
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

    const rawFoo = { hello: 'world' };
    const fooUpdate = { id: 1, hello: 'world' };
    const foo = { id: 1, hello: 'world', __typename: 'Foo' };
    const TestComponent = () => 'test';
    const defaultOptions = {
        collection: Foo,
        fragmentName: fragmentName,
        fragment
    };
    describe('imports', () => {
        expect(useCreate).toBeInstanceOf(Function)
        expect(useUpdate).toBeInstanceOf(Function)
        expect(useUpsert).toBeInstanceOf(Function)
        expect(useDelete).toBeInstanceOf(Function)
        expect(withCreate).toBeInstanceOf(Function)
        expect(withUpdate).toBeInstanceOf(Function)
        expect(withUpsert).toBeInstanceOf(Function)
        expect(withDelete).toBeInstanceOf(Function)
    })
    describe('withCreate', () => {
        // NOT passing for no reason...
        // @see https://github.com/apollographql/react-apollo/issues/3478
        test('run a create mutation', async () => {
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
                    data: {
                        createFoo: {
                            data: foo,
                            __typename: 'Foo'
                        },
                    }
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
            expect(res).toEqual({ data: { createFoo: { data: foo, __typename: 'Foo' } } });
        });
    });

    describe('update', () => {
        test('run update mutation', async () => {
            const UpdateComponent = withUpdate(defaultOptions)(TestComponent)
            const responses = [{
                request: {
                    query: gql`
                    mutation updateFoo($selector: FooSelectorUniqueInput!, $data: UpdateFooDataInput!) {
                        updateFoo(selector: $selector, data: $data) {
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
                        //selector: { documentId: foo.id },
                        data: fooUpdate
                    }
                },
                result: {
                    data: {
                        updateFoo: {
                            data: foo,
                            __typename: 'Foo'
                        }
                    }
                }
            }]
            const wrapper = mount(
                <MockedProvider mocks={responses} >
                    <UpdateComponent />
                </MockedProvider>
            )
            expect(wrapper.find(TestComponent).prop('updateFoo')).toBeInstanceOf(Function)
            const res = await wrapper.find(TestComponent).prop('updateFoo')({
                data: fooUpdate
            })
            expect(res).toEqual({ data: { updateFoo: { data: foo, __typename: 'Foo' } } })
        })
    })
    describe('upsert', () => {
        test('run upsert mutation', async () => {
            const UpsertComponent = withUpsert(defaultOptions)(TestComponent)
            const responses = [{
                request: {
                    query: gql`
                    mutation upsertFoo($selector: FooSelectorUniqueInput!, $data: UpdateFooDataInput!) {
                        upsertFoo(selector: $selector, data: $data) {
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
                        data: fooUpdate
                    }
                },
                result: {
                    data: {
                        upsertFoo: {
                            data: foo,
                            __typename: 'Foo'
                        }
                    }
                }
            }]
            const wrapper = mount(
                <MockedProvider mocks={responses} >
                    <UpsertComponent />
                </MockedProvider>
            )
            expect(wrapper.find(TestComponent).prop('upsertFoo')).toBeInstanceOf(Function)
            const res = await wrapper.find(TestComponent).prop('upsertFoo')({
                data: fooUpdate
            })
            expect(res).toEqual({ data: { upsertFoo: { data: foo, __typename: 'Foo' } } })
        })
    })
    describe('delete', () => {
        test('run delete mutations', async () => {
            const DeleteComponent = withDelete(defaultOptions)(TestComponent)
            const responses = [{
                request: {
                    query: gql`
                    mutation deleteFoo($selector: FooSelectorUniqueInput!) {
                       deleteFoo(selector: $selector) {
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
                        selector: {
                            documentId: "42"
                        }
                    }
                },
                result: {
                    data: {
                        deleteFoo: {
                            data: foo,
                            __typename: 'Foo'
                        }
                    }
                }
            }]
            const wrapper = mount(
                <MockedProvider mocks={responses} >
                    <DeleteComponent />
                </MockedProvider>
            )
            expect(wrapper.find(TestComponent).prop('deleteFoo')).toBeInstanceOf(Function)
            const res = await wrapper.find(TestComponent).prop('deleteFoo')({
                selector: { documentId: "42" }
            })
            expect(res).toEqual({ data: { deleteFoo: { data: foo, __typename: 'Foo' } } })

        })
    })

});