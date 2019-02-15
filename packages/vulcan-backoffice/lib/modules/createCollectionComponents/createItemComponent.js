import React, { PureComponent } from 'react';
import { registerComponent, Components, withSingle, withAccess } from 'meteor/vulcan:core';
import { getItemComponentName } from '../namingHelpers';
import { withRouteParam } from '../../hocs/withRouteParam';
/**
 * Create the item details page
 */
const createItemComponent = (collection, options) => {
  const componentName = getItemComponentName(collection);
  const component = class DetailsComponent extends PureComponent {
    render() {
      const { loading, document } = this.props;
      return (
        <Components.VulcanBackofficeCollectionItem
          collection={collection}
          loading={loading}
          document={document}
          headerText={options.item.headerText}
          fields={options.item.fields}
        />
      );
    }
  };
  component.displayName = componentName;
  const withDocumentOptions = {
    collection,
  };
  const withAccessOptions = {
    groups: options.item.accessGroups,
    redirect: options.item.accessRedirect,
  };
  registerComponent({
    name: componentName,
    component: component,
    hocs: [
      [withAccess, withAccessOptions],
      withRouteParam('documentId'),
      [withSingle, withDocumentOptions],
    ],
  });
  return component; // return if the component is needed
};
export default createItemComponent;
