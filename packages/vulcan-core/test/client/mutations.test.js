import { registerWatchedMutations } from '../../lib/modules/default_mutations';
import expect from 'expect';

describe('vulcan:core/registerWatchedMutations', function(){
    it('should registerWatchedMutations without failing', function(){
        registerWatchedMutations({
            create:{
                name:'createFoo'
            },
            update:{
                name:'updateFoo'
            },
            delete:{
                name: 'deleteFoo'
            }
        }, 'Foo');
        expect(true).toBe(true);
    });
});