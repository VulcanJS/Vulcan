/**
 * Generic page for a collection
 * Must be handled by the parent :
 * - providing the documents and callbacks
 */

import React from 'react';
import { Components, registerComponent, withCurrentUser, withAccess } from 'meteor/vulcan:core';
// TODO: get options from backoffice config
const accessOptions = {
  groups: ['admins'],
  redirect: '/backoffice',
  message: 'Sorry, you do not have the rights to access this page.',
};

export const CollectionList = props => {
  return <Components.Datatable collection={props.collection} />;
};

export default CollectionList;
registerComponent({
  name: 'VulcanBackofficeCollectionList',
  component: CollectionList,
  hocs: [withCurrentUser, [withAccess, accessOptions]],
});
