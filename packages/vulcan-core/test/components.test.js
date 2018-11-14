// setup JSDOM server side for testing (necessary for Enzyme to mount)
import 'jsdom-global/register';
import React from 'react';
import expect from 'expect';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Components } from 'meteor/vulcan:core';


// we must import all the other components, so that "registerComponent" is called
import '../lib/modules';
import Datatable from '../lib/modules/components/Datatable'

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
}

const Articles = createDummyCollection('Article', {
    name: {
        type: String
    }
})
registerFragment(`
   fragment ArticlesDefaultFragment on Article {
       name
   }
`);


// setup enzyme
// TODO: write a reusable helper and move this to the tests setup
Enzyme.configure({ adapter: new Adapter() });

// and then load them in the app so that <Component.Whatever /> is defined
import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib';
// we need registered fragments to be initialized because populateComponentsApp will run
// hocs, like withUpdate, that rely on fragments
initializeFragments();
// actually fills the Components object
populateComponentsApp();


describe('vulcan-core/components', function () {
    describe('DataTable', function () {
        it('shallow renders DataTable', function () {
            const wrapper = shallow(<Datatable
                collection={Articles} />)
            expect(wrapper).toBeDefined()
        })
        it('render a static version', function () {
            const wrapper = shallow(<Datatable
                data={[{ name: 'foo' }, { name: 'bar' }]} />)
            const content = wrapper.find('DatatableContents').first()
            expect(content).toBeDefined()
        })
    })
})