import { mergeWithComponents } from '../lib/modules/components';
import { Components } from 'meteor/vulcan:core';
import expect from 'expect';
import { initComponentTest } from 'meteor/vulcan:test';

initComponentTest();

describe('vulcan:lib/components', function () {
    describe('mergeWithComponents', function () {
        const TestComponent = () => 'foo';
        const OverrideTestComponent = () => 'bar';
        Components.TestComponent = TestComponent;
        it('override existing components', function () {
            const MyComponents = { TestComponent: OverrideTestComponent };
            const MergedComponents = mergeWithComponents(MyComponents);
            expect(MergedComponents.TestComponent).toEqual(OverrideTestComponent);
            // eslint-disable-next-line
            expect(MergedComponents.TestComponent()).toEqual('bar');
        });
        it('return \'Components\' if no components are provided', function () {
            expect(mergeWithComponents()).toEqual(Components);
            expect(mergeWithComponents().TestComponent).toEqual(TestComponent);
        });

    });
});
