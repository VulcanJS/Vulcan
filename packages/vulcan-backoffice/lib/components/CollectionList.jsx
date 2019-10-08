/**
 * Generic page for a collection
 * Must be handled by the parent :
 * - providing the documents and callbacks
 */

import React from 'react';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';

export const CollectionList = props => <Components.Datatable {...props} />;

export default CollectionList;
registerComponent({
  name: 'VulcanBackofficeCollectionList',
  component: CollectionList,
  hocs: [withCurrentUser],
});
