import { Components, registerComponent } from 'meteor/vulcan:core';
import React from 'react';

const CollectionsSingle = (props, context) => {
  return <Components.CollectionsPage documentId={props.params._id} />
};

CollectionsSingle.displayName = "CollectionsSingle";

registerComponent('CollectionsSingle', CollectionsSingle);
