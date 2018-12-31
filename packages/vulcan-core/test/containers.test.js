// setup JSDOM server side for testing (necessary for Enzyme to mount)
import 'jsdom-global/register';
import React from 'react';
import expect from 'expect';
import { shallow } from 'enzyme';
import { Components } from 'meteor/vulcan:core';
import { initComponentTest } from 'meteor/vulcan:test';
import { withComponents } from '../lib/modules';


// we must import all the other components, so that "registerComponent" is called
import '../lib/modules';
// setup Vulcan (load components, initialize fragments)
initComponentTest();


describe('vulcan-core/containers', function () {
    describe('withComponents', function () {
        it('should override components', function () {
            // replace any component for testing purpose
            const firstComponentName = Components[Object.keys(Components)[0]];
            const FooComponent = () => 'FOO';
            const components = { [firstComponentName]: FooComponent};
            const MyComponent = withComponents(({ Components }) => Components[firstComponentName]());
            const wrapper = shallow(<MyComponent components={components} />) ;
            expect(wrapper.prop('Components')).toBeDefined();
            expect(wrapper.prop('Components')[firstComponentName]).toEqual(FooComponent);
            expect(wrapper.html()).toEqual('FOO');

        });
    });
});