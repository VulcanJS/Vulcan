import React from 'react';
import {
    withCreate2,
    useCreate2,
} from '../../lib/modules';
import {
    multiQueryUpdater,
    buildCreateQuery,
} from '../../lib/modules/containers/create2'
import { MockedProvider, createDummyCollection } from 'meteor/vulcan:test';
import { mount } from 'enzyme';
import expect from 'expect';
import gql from 'graphql-tag';
import sinon from 'sinon'

const test = it;

describe('vulcan:core/container/mutations2', () => {
    const typeName = 'Foo';
    const Foo = createDummyCollection({
        options: {
            collectionName: 'Foos',
            typeName,
            multiResolverName: 'foos'
        },
        schema: { val: { type: Number, canRead: ['guests'] } }
    });
    const fragmentName = 'FoosDefaultFragment';
    const fragment = {
        definitions: [{
            name: {
                value: fragmentName
            }
        }],
        toString: () => `fragment FoosDefaultFragment on Foo { 
        _id
        hello
        __typename
      }`
    };

    const rawFoo = { hello: 'world' };
    const fooUpdate = { _id: 1, hello: 'world' };
    const foo = { _id: 1, hello: 'world', __typename: 'Foo' };
    const TestComponent = () => 'test';
    const defaultOptions = {
        collection: Foo,
        fragmentName: fragmentName,
        fragment
    };
    describe('withCreate', () => {
        // NOT passing for no reason...
        // @see https://github.com/apollographql/react-apollo/issues/3478
        test('run a create mutation', async () => {
            const CreateComponent = withCreate2(defaultOptions)(TestComponent);
            const responses = [{
                request: {
                    query: buildCreateQuery({ fragmentName, fragment, typeName }),
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

        describe('multiQuery update after create mutation for optimistic UI', () => {
            const defaultOptions = {
                typeName, fragment, fragmentName,
                collection: Foo,
            }
            const defaultCacheContent = {
                foos: {
                    results: [],
                    totalCount: 0
                }
            }
            const makeCacheData = (vars = { input: { filter: {} } }) => ({
                data: {
                    ROOT_QUERY: {
                        // variables are contained in the query name
                        [`foos(${JSON.stringify(vars)})`]: {}
                    }
                }
            })
            const defaultCacheData = makeCacheData({})

            beforeEach(() => {
                Foo.getParameters = (terms) => ({
                    selector: {},
                    options: {}
                }
                )
            })
            test('add document to multi query after a creation', async () => {
                const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' })

                const writeQuery = sinon.spy()
                const cache = {
                    readQuery: () => defaultCacheContent,
                    writeQuery,
                    data: defaultCacheData
                }
                await update(cache, {
                    data: {
                        createFoo: {
                            data: foo
                        }
                    }
                })
                expect(writeQuery.calledOnce).toBe(true)
            })
            test('update document if already there', async () => {
                const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' })

                const writeQuery = sinon.spy()
                const cache = {
                    readQuery: () => ({
                        ...defaultCacheContent,
                        foos: {
                            results: [foo],
                            totalCount: 1
                        }
                    }),
                    writeQuery,
                    data: defaultCacheData
                }
                const updateFoo = { ...foo, UPDATED: true }
                await update(cache, {
                    data: {
                        createFoo: {
                            data: updateFoo
                        }
                    }
                })
                expect(writeQuery.calledOnce).toBe(true)
                expect(writeQuery.getCall(0).args[0]).toMatchObject({
                    data: { 'foos': { results: [updateFoo], totalCount: 1 } }
                })
            })
            test('do not add document if it does not match the mongo selector of the query', async () => {
                const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' })

                const writeQuery = sinon.spy()
                const cache = {
                    readQuery: () => defaultCacheContent,
                    writeQuery,
                    data: makeCacheData({
                        input: {
                            filter: { val: { _gt: 42 } }
                        }
                    })
                }
                const newFoo = { ...foo, val: 41 }
                await update(cache, {
                    data: {
                        createFoo: {
                            data: newFoo
                        }
                    },
                })
                expect(writeQuery.notCalled).toBe(true)
            })
            test('add document if it does match the mongo selector', async () => {
                const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' })

                const writeQuery = sinon.spy()
                const cache = {
                    readQuery: () => defaultCacheContent,
                    writeQuery,
                    data: makeCacheData({
                        input: {
                            filter: { val: { _gt: 42 } }
                        }
                    })
                }
                const newFoo = { ...foo, val: 46 }
                await update(cache, {
                    data: {
                        createFoo: {
                            data: newFoo
                        }
                    }
                })
                expect(writeQuery.calledOnce).toBe(true)
            })
            test('sort documents', async () => {
                const update = multiQueryUpdater({ ...defaultOptions, resolverName: 'createFoo' })

                const writeQuery = sinon.spy()
                const cache = {
                    readQuery: () => ({
                        foos: {
                            results: [{ val: 40 }, { val: 43 }],
                            totalCount: 2
                        }
                    }),
                    writeQuery,
                    data: makeCacheData({
                        input: {
                            sort: {
                                val: "asc"
                            }
                        }
                    })
                }
                const newFoo = { ...foo, val: 42 }
                await update(cache, {
                    data: {
                        createFoo: {
                            data: newFoo
                        }
                    }
                })
                const res = writeQuery.getCall(0).args[0].data.foos.results
                expect(res).toHaveLength(3)
                expect(res[1]).toEqual(newFoo)
            })
        })
    });

});
