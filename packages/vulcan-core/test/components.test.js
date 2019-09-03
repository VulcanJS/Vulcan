import React from 'react';
import expect from 'expect';
import { mount, shallow } from 'enzyme';
import { Components } from 'meteor/vulcan:core';
import { initComponentTest } from 'meteor/vulcan:test';


// we must import all the other components, so that "registerComponent" is called
import '../lib/modules';
import Datatable from '../lib/modules/components/Datatable';
// stub collection
import { createCollection, getDefaultResolvers, getDefaultMutations, registerFragment } from 'meteor/vulcan:core';
const createDummyCollection = (typeName, schema) => {
    return createCollection({
        collectionName: typeName + 's',
        typeName,
        schema,
        resolvers: getDefaultResolvers(typeName + 's'),
        mutations: getDefaultMutations(typeName + 's')
    });
};
const Articles = createDummyCollection('Article', {
    name: {
        type: String
    }
});
registerFragment(`
   fragment ArticlesDefaultFragment on Article {
       name
   }
`);

// setup Vulcan (load components, initialize fragments)
initComponentTest();


describe('vulcan-core/components', function () {
    describe('DataTable', function () {
        it('shallow renders DataTable', function () {
            const wrapper = shallow(<Datatable
                Components={Components}
                collection={Articles} />);
            expect(wrapper).toBeDefined();
        });
        it('render a static version', function () {
            const wrapper = shallow(<Datatable
                Components={Components}
                data={[{ name: 'foo' }, { name: 'bar' }]} />);
            const content = wrapper.find('DatatableContents').first();
            expect(content).toBeDefined();
        });
        const context = {
            intl: {
                formatMessage: () => { },
                formatDate: () => { },
                formatTime: () => { },
                formatRelative: () => { },
                formatNumber: () => { },
                formatPlural: () => { },
                formatHTMLMessage: () => { },
                now: () => { }
            }
        };
        it.skip('mounts a static version', function () {
            const wrapper = mount(
                <Datatable
                    Components={Components}
                    data={[{ name: 'foo' }, { name: 'bar' }]}
                />
                , {
                    context,
                    childContextTypes: context
                });
            expect(wrapper).toBeDefined();
            //const content = wrapper.find('DatatableContents').first();
            //expect(content).toBeDefined();
        });
    });
});