import { getDefaultMutations } from '../lib/modules/default_mutations';

import expect from 'expect';


describe('vulcan:core/default_mutations', function() {

    it('returns mutations', function(){
        const mutations = getDefaultMutations({
            typeName:'Foo',
            collectionName:'Foos',
            options: {}
        });
        expect(mutations.create).toBeDefined();
        expect(mutations.update).toBeDefined();
        expect(mutations.delete).toBeDefined();
    });
    it('preserves openCRUD backward compatibility', function(){
        const mutations = getDefaultMutations({
            typeName:'Foo',
            collectionName:'Foos',
            options: {}
        });
        expect(mutations.new).toBeDefined();
        expect(mutations.edit).toBeDefined();
        expect(mutations.remove).toBeDefined();
    });

});