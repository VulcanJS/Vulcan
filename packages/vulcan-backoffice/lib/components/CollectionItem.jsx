/**
 * Generic page for a collection element
 *
 * Must be handled by the parent :
 * - the document, using withDocument and options
 */

import React from 'react';
import { registerComponent, Components, withCurrentUser } from 'meteor/vulcan:core';

const CollectionItemDetails = props => {
  if (props.loading) return <Components.Loading />;
  if (!props.document) return 'Document not found';
  return <Components.Card {...props} />;
};

registerComponent({
  name: 'VulcanBackofficeCollectionItem',
  component: CollectionItemDetails,
  hocs: [withCurrentUser],
});
