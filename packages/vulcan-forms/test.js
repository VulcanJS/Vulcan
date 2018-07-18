import FormWrapper from 'meteor/vulcan:forms';
import expect from "expect"

describe('vulcan:forms', function () {
    it('initialize', function () {
        expect(FormWrapper.name).toEqual('GraphQL')
    })
})