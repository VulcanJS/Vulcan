import expect from 'expect';
import Users from '../../lib/modules/collection';
import StubCollections from 'meteor/hwillson:stub-collections';

const test = it;

const { create: createUser } = Users.options.mutations;

//const fooUser = { _id: 'foobar' };
/*
const context = {
    // TODO: move this into vulcan:tests
    Users: {
        findOne: () => fooUser,
        remove: () => 1,
        options: {
            collectionName: 'Users',
            typeName: 'User'
        },
        simpleSchema: () => new SimpleSchema({ _id: { type: String, canRead: ['admins'] } }),
        restrictViewableFields: (currentUser, collection, doc) => doc
    },
    currentUser: {
        isAdmin: true,
        groups: ['admins']
    }
};
*/
describe('vulcan:users/mutations', () => {

    beforeEach(function () {
        StubCollections.stub(Users);
    });
    afterEach(function () {
        StubCollections.restore();
    });

    describe('create user', () => {
        const context = {
            Users,
            currentUser: { isAdmin: true }
        };
        test('respect email if provided', async () => {
            const email = 'foobar@foo.com';
            const user = { email };
            const { data: userDocument } = await createUser.mutation(null, { data: user }, context);
            expect(userDocument.email).toEqual(email);
        });
        test('add email to emails array (for Meteor legacy compatibility)', async () => {
            const email = 'foobar@foo.com';
            const user = { email };
            const { data: userDocument } = await createUser.mutation(null, { data: user }, context);
            expect(userDocument.emails).toBeDefined();
            expect(userDocument.emails[0]).toEqual({ address: email });
        });

    });
});