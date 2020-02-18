import { getNewDefaultMutations } from '../../lib/server/default_mutations2';
import SimpleSchema from 'simpl-schema';
import Users from 'meteor/vulcan:users';

import expect from 'expect';
import { createDummyCollection } from 'meteor/vulcan:test';
const test = it;


describe('vulcan:lib/default_mutations', function () {

    it('returns mutations', function () {
        const mutations = getNewDefaultMutations({
            typeName: 'Foo',
            collectionName: 'Foos',
            options: {}
        });
        expect(mutations.create).toBeDefined();
        expect(mutations.update).toBeDefined();
        expect(mutations.delete).toBeDefined();
    });

    describe('delete mutation', () => {
        const foo = { _id: 'foo' };
        const Foos = createDummyCollection({
            results: {
                findOne: foo
            },
            collectionName: 'Foos',
            schema: { _id: { type: String, canRead: ['admins'] } }
        })
        const context = {
            Users,/*: {
                options: {
                    collectionName: 'Users',
                    typeName: 'User'
                },
                simpleSchema: () => new SimpleSchema({ _id: { type: String, canRead: ['admins'] } }),
                restrictViewableFields: (currentUser, collection, doc) => doc
            },*/
            Foos,
            currentUser: {
                isAdmin: true,
                groups: ['admins']
            }
        };
        const mutations = getNewDefaultMutations({
            typeName: 'Foo',
            collectionName: 'Foos',
            options: {}
        });
        // We do not need this test anymore because the delete mutator (called by the mutation)
        // will test the selector itself (selector should return a document, otherwise it is ignored)
        //test('refuse deletion if selector is empty', async () => {
        //    const { delete: deleteMutation } = mutations;
        //    const emptySelector = {};
        //    const nullSelector = { documentId: null };
        //    const validIdSelector = { _id: 'foobar' };
        //    const validDocIdSelector = { documentId: 'foobar' };
        //    const validSlugSelector = { slug: 'foobar' };
        //
        //            // const { mutation } = deleteMutation; // won't work because "this" must equal deleteMutation to access "check"
        //            await expect(deleteMutation.mutation(null, { input: { selector: emptySelector } }, context)).rejects.toThrow();
        //            await expect(deleteMutation.mutation(null, { input: { selector: nullSelector } }, context)).rejects.toThrow();
        //
        //            await expect(deleteMutation.mutation(null, { input: { selector: validIdSelector } }, context)).resolves.toEqual({ data: foo });
        //            await expect(deleteMutation.mutation(null, { input: { selector: validDocIdSelector } }, context)).resolves.toEqual({ data: foo });
        //            await expect(deleteMutation.mutation(null, { input: { selector: validSlugSelector } }, context)).resolves.toEqual({ data: foo });
        //        });

    });


});