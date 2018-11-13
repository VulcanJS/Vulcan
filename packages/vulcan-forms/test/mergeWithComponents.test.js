import mergeWithComponents from '../lib/modules/mergeWithComponents';
import { Components } from 'meteor/vulcan:core';
import expect from 'expect';
// we must import all the other components, so that "registerComponent" is called
import '../lib/modules/components';
// and then load them in the app so that <Component.Whatever /> is defined
import { populateComponentsApp, initializeFragments } from 'meteor/vulcan:lib';
// we need registered fragments to be initialized because populateComponentsApp will run
// hocs, like withUpdate, that rely on fragments
initializeFragments();
// actually fills the Components object
populateComponentsApp();

describe('vulcan-forms/mergeWithComponents', function() {
  const TestComponent = () => {};
  const OverrideTestComponent = () => {};
  Components.TestComponent = TestComponent;
  const MyComponents = { TestComponent: OverrideTestComponent };
  it('override existing components', function() {
    const MergedComponents = mergeWithComponents(MyComponents);
    expect(MergedComponents.TestComponent).toEqual(OverrideTestComponent);
  });
  it('return \'Components\' if no components are provided', function() {
    expect(mergeWithComponents()).toEqual(Components);
  });
});
