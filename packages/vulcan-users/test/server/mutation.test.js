import expect from 'expect';
import mutations from '../../lib/modules/mutations';
import SimpleSchema from 'simpl-schema';
import Users from '../../lib/modules/collection';
import StubCollections from 'meteor/hwillson:stub-collections';

const test = it;

const { create: createUser, delete: deleteMutation, update } = mutations;

const fooUser = { _id: 'foobar' };
const context = {
    // TODO: move this into vulcan:tests
    Users: {
        findOne: () => fooUser,
        remove: () => 1,
        options: {
            collectionName: 'Users',
            typeName: 'User'
        },
        simpleSchema: () => new SimpleSchema({ _id: { type: String, canRead: ['admins'] } })
    },
    currentUser: {
        isAdmin: true,
        groups: ['admins']
    }
};
describe('vulcan:users/mutations', () => {

    beforeEach(function () {
        StubCollections.stub(Users);
    });
    afterEach(function () {
        StubCollections.restore();
    });
    describe('deleteMutation', () => {
        // const { mutation } = deleteMutation; // won't work because "this" must equal deleteMutation to access "check"
        test('must provide a valid selector that returns at most one user', async () => {
            const emptySelector = {};
            const nullSelector = { documentId: null };
            const validIdSelector = { _id: 'foobar' };
            const validDocIdSelector = { documentId: 'foobar' };
            const validSlugSelector = { slug: 'foobar' };

            expect(deleteMutation.mutation(null, { selector: emptySelector }, context)).rejects;
            expect(deleteMutation.mutation(null, { selector: nullSelector }, context)).rejects;

            await expect(deleteMutation.mutation(null, { selector: validIdSelector }, context)).resolves.toEqual({ data: { _id: 'foobar' } });
            await expect(deleteMutation.mutation(null, { selector: validDocIdSelector }, context)).resolves.toEqual({ data: { _id: 'foobar' } });
            await expect(deleteMutation.mutation(null, { selector: validSlugSelector }, context)).resolves.toEqual({ data: { _id: 'foobar' } });
        });

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