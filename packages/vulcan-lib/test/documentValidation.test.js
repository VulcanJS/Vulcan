import { createDummyCollection } from "meteor/vulcan:test"
import { validateDocument, validateData } from "../lib/modules/validation"
import expect from 'expect'
import './routes.test';
import SimpleSchema from "simpl-schema"
import Users from "meteor/vulcan:users"

const test = it

const defaultContext = { Users }
describe("vulcan:lib/validation", () => {
    describe("validate document permissions per field (on creation and update)", () => {
        test('no error if all fields are creatable', () => {
            const collection = createDummyCollection({
                schema: {
                    foo: {
                        type: String,
                        canCreate: ['guests'],
                        canUpdate: ['guests']
                    }
                }
            })
            // create
            const errors = validateDocument({ foo: "bar" }, collection, defaultContext)
            expect(errors).toHaveLength(0)
            const updateErrors = validateData({ foo: "bar" }, { foo: "bar" }, collection, defaultContext)
            expect(updateErrors).toHaveLength(0)
        })
        test('create error for non creatable field', () => {
            const collection = createDummyCollection({
                schema: {
                    foo: {
                        type: String,
                        canCreate: ['members'],
                        canUpdate: ['members']
                    },
                    bar: {
                        type: String,
                        canCreate: ['guests'],
                        canUpdate: ['guests']
                    }
                }
            })
            const errors = validateDocument({ foo: "bar", bar: "foo" }, collection, defaultContext)
            expect(errors).toHaveLength(1)
            expect(errors[0]).toMatchObject({
                id: "errors.disallowed_property_detected",
                properties: { name: "foo" }
            })
            const updateErrors = validateData({ foo: "bar", bar: "foo" }, { foo: "bar", bar: "foo" }, collection, defaultContext)
            expect(updateErrors).toHaveLength(1)
            expect(updateErrors[0]).toMatchObject({
                id: "errors.disallowed_property_detected",
                properties: { name: "foo" }
            })
        })

        test('create error for non creatable nested field (object)', () => {
            const collection = createDummyCollection({
                schema: {
                    nested: {
                        type: new SimpleSchema({
                            foo: {
                                type: String,
                                canCreate: ["members"],
                                canUpdate: ["members"]
                            },
                            zed: {
                                optional: true,
                                type: String,
                                canCreate: ["members"],
                                canUpdate: ["members"]
                            },
                            bar: {
                                type: String,
                                canCreate: ["guests"],
                                canUpdate: ["guests"]
                            },
                        }),
                        canCreate: ["guests"],
                        canUpdate: ["guests"]
                    }
                }
            })
            // create
            const errors = validateDocument({ nested: { foo: "bar", bar: "foo" } }, collection, defaultContext)
            expect(errors).toHaveLength(1)
            expect(errors[0]).toMatchObject({
                id: "errors.disallowed_property_detected",
                properties: { name: "nested.foo" }
            })
            // update with set and unset
            const updateErrors = validateData({ nested: { foo: "bar", bar: "foo", zed: null } }, { nested: { foo: "bar", bar: "foo", zed: "hello" } }, collection, defaultContext)
            expect(updateErrors).toHaveLength(2)
            expect(updateErrors[0]).toMatchObject({
                id: "errors.disallowed_property_detected",
                properties: { name: "nested.foo" }
            },
                {
                    id: "errors.disallowed_property_detected",
                    properties: { name: "nested.zed" }
                },
            )
        })
        test('create error for non creatable nested field (array)', () => {
            const collection = createDummyCollection({
                schema: {
                    nested: {
                        type: Array,
                        canCreate: ["guests"],
                        canUpdate: ["guests"]
                    },
                    "nested.$": {
                        type: new SimpleSchema({
                            foo: {
                                type: String,
                                canCreate: ["members"],
                                canUpdate: ["members"]
                            },
                            bar: {
                                type: String,
                                canCreate: ["guests"],
                                canUpdate: ["guests"]
                            }
                        })
                    }
                }
            })
            const errors = validateDocument({ nested: [{ foo: "bar", bar: "foo" }] }, collection, defaultContext)
            expect(errors).toHaveLength(1)
            expect(errors[0]).toMatchObject({
                id: "errors.disallowed_property_detected",
                properties: { name: "nested[0].foo" }
            })

            const updateErrors = validateData({ nested: [{ foo: "bar", bar: "foo" }] }, { nested: [{ foo: "bar", bar: "foo" }] }, collection, defaultContext)
            expect(updateErrors).toHaveLength(1)
            expect(updateErrors[0]).toMatchObject({
                id: "errors.disallowed_property_detected",
                properties: { name: "nested[0].foo" }
            })
        })

        test('do not check permissions of blackbox JSON', () => {
            const collection = createDummyCollection({
                schema: {
                    nested: {
                        type: Object,
                        blackbox: true,
                        canCreate: ["guests"],
                        canUpdate: ["guests"],
                    },
                }
            })
            const errors = validateDocument({ nested: { foo: "bar" } }, collection, defaultContext)
            expect(errors).toHaveLength(0)

            const updateErrors = validateData({ nested: { foo: "bar" } }, { nested: { foo: "bar" } }, collection, defaultContext)
            expect(updateErrors).toHaveLength(0)
        })
        test('do not check native arrays', () => {
            const collection = createDummyCollection({
                schema: {
                    array: {
                        type: Array,
                        canCreate: ["guests"],
                        canUpdate: ["guests"]
                    },
                    "array.$": {
                        type: Number
                    }
                }
            })
            const errors = validateDocument({ array: [1, 2, 3] }, collection, defaultContext)
            expect(errors).toHaveLength(0)

            const updateErrors = validateData({ array: [1, 2, 3] }, { array: [1, 2, 3] }, collection, defaultContext)
            expect(updateErrors).toHaveLength(0)
        })
    })

})