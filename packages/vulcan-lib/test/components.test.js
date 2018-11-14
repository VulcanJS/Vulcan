import { mergeWithComponents } from '../lib/modules/components'
import { Components } from 'meteor/vulcan:core';
import expect from 'expect';
import { initComponentTest } from 'meteor/vulcan:test'

initComponentTest()

describe('vulcan:lib/components', function () {
    describe('mergeWithComponents', function () {
        const TestComponent = () => { };
        const OverrideTestComponent = () => { };
        Components.TestComponent = TestComponent;
        const MyComponents = { TestComponent: OverrideTestComponent };
        it('override existing components', function () {
            const MergedComponents = mergeWithComponents(MyComponents);
            expect(MergedComponents.TestComponent).toEqual(OverrideTestComponent);
        });
        it('return \'Components\' if no components are provided', function () {
            expect(mergeWithComponents()).toEqual(Components);
        });

    })
})
