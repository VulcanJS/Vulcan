import Users from '../lib/modules/collection'
import '../lib/modules/permissions'
const test = it
import expect from "expect"
import { createDummyCollection } from "meteor/vulcan:test"

describe('vulcan:users/permissions', () => {
    const Dummies = createDummyCollection({
        schema: {
            guestField: {
                type: String,
                canRead: ['guests']
            },
            adminField: {
                type: String,
                canRead: ['admins']

            }
        }
    })
    test("getViewableFields as projection (legacy)", () => {
        const fields = Users.getViewableFields(null, Dummies)
        expect(fields).toEqual({
            guestField: true
        })

    })
    test('getReadableFields', () => {
        const fields = Users.getReadableFields(null, Dummies)
        expect(fields).toEqual(["guestField"])
    })
    test('getReadableProjection', () => {
        const fields = Users.getReadableProjection(null, Dummies)
        expect(fields).toEqual({ guestField: true })

    })
    test('checkFields', () => {
        expect(() => Users.checkFields(null, Dummies, ['adminField'])).toThrow()
        expect(Users.checkFields(null, Dummies, ['guestField'])).toBe(true)
    })
    test('restrictViewableFields', () => {
        const fields = Users.restrictViewableFields(null, Dummies, { 'adminField': "foo", 'guestField': "bar" })
        expect(fields).toEqual({ 'guestField': "bar" })
    })
})