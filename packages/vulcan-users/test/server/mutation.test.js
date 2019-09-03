import expect from 'expect';
import mutations from '../../lib/modules/mutations';
import SimpleSchema from 'simpl-schema';

const test = it;

const { create, delete: deleteMutation, update } = mutations;

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
});