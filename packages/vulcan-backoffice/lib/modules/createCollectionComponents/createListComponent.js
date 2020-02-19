import React, { PureComponent } from 'react';
import { registerComponent, Components, withAccess } from 'meteor/vulcan:core';
import { getListComponentName } from '../namingHelpers';

const createListComponent = (collection, options) => {
  const component = class ListComponent extends PureComponent {
    render() {
      const { ...otherProps } = this.props;
      const { list } = options;
      const { ...otherListOptions } = list;
      return (
        <Components.VulcanBackofficeCollectionList
          collection={collection}
          {...otherListOptions}
          {...otherProps}
        />
      );
    }
  };

  const withAccessOptions = {
    groups: options.list.accessGroups,
    redirect: options.list.accessRedirect,
  };

  const componentName = getListComponentName(collection);
  component.displayName = componentName;

  registerComponent({
    name: componentName,
    component: component,
    hocs: [[withAccess, withAccessOptions]],
  });
  return component;
};
export default createListComponent;
