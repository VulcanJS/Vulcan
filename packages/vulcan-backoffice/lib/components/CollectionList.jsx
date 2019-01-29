/**
 * Generic page for a collection
 * Must be handled by the parent :
 * - providing the documents and callbacks
 */

import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';


export const CollectionList = ({
  //loading,
  collection,
  sort,
}) => (
  <Components.Datatable
    collection={collection}
    sort={sort}
  />
);

export default CollectionList;
registerComponent({
  name: 'VulcanBackofficeCollectionList',
  component: CollectionList,
});
