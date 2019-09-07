import { getDefaultMutations } from '../lib/modules/default_mutations';
import SimpleSchema from 'simpl-schema';

import expect from 'expect';
const test = it;


describe('vulcan:core/default_mutations', function () {

    it('returns mutations', function () {
        const mutations = getDefaultMutations({
            typeName: 'Foo',
            collectionName: 'Foos',
            options: {}
        });
        expect(mutations.create).toBeDefined();
        expect(mutations.update).toBeDefined();
        expect(mutations.delete).toBeDefined();
    });
    it('preserves openCRUD backward compatibility', function () {
        const mutations = getDefaultMutations({
            typeName: 'Foo',
            collectionName: 'Foos',
            options: {}
        });
        expect(mutations.new).toBeDefined();
        expect(mutations.edit).toBeDefined();
        expect(mutations.remove).toBeDefined();
    });

    describe('delete mutation', () => {
        const foo = { _id: 'foo' };
        const context = {
            Users: {
                options: {
                    collectionName: 'Users',
                    typeName: 'User'
                },
                simpleSchema: () => new SimpleSchema({ _id: { type: String, canRead: ['admins'] } })
            },
            Foos: {
                findOne: () => foo,
                remove: () => 1,
                options: {
                    collectionName: 'Foos',
                    typeName: 'Foo'
                },
                simpleSchema: () => new SimpleSchema({ _id: { type: String, canRead: ['admins'] } })
            }
            ,
            currentUser: {
                isAdmin: true,
                groups: ['admins']
            }
        };
        const mutations = getDefaultMutations({
            typeName: 'Foo',
            collectionName: 'Foos',
            options: {}
        });
        test('refuse deletion if selector is empty', async () => {
            const { delete: deleteMutation } = mutations;
            const emptySelector = {};
            const nullSelector = { documentId: null };
            const validIdSelector = { _id: 'foobar' };
            const validDocIdSelector = { documentId: 'foobar' };
            const validSlugSelector = { slug: 'foobar' };

            // const { mutation } = deleteMutation; // won't work because "this" must equal deleteMutation to access "check"
            expect(deleteMutation.mutation(null, { selector: emptySelector }, context)).rejects;
            expect(deleteMutation.mutation(null, { selector: nullSelector }, context)).rejects;

            await expect(deleteMutation.mutation(null, { selector: validIdSelector }, context)).resolves.toEqual({ data: foo });
            await expect(deleteMutation.mutation(null, { selector: validDocIdSelector }, context)).resolves.toEqual({ data: foo });
            await expect(deleteMutation.mutation(null, { selector: validSlugSelector }, context)).resolves.toEqual({ data: foo });
        });

    });


});