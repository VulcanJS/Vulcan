/**
 * Generic page for a collection element
 *
 * Must be handled by the parent :
 * - the document, using withDocument and options
 */

import React from 'react';
import { registerComponent, Components, withCurrentUser } from 'meteor/vulcan:core';


const CollectionItemDetails = ({ document, currentUser, collection }) => {
  <Components.Card
    collection={collection}
    document={document}
    currentUser={currentUser}
  />;
};

registerComponent({
  name: 'VulcanBackofficeCollectionItem', 
  component: CollectionItemDetails, 
  hocs: [withCurrentUser]
});
