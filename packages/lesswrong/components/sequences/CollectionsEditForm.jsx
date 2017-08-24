import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Collections from '../../lib/collections/collections/collection.js';

const CollectionsEditForm = (props) => {
  return (
    <div className="chapters-edit-form">
      <Components.SmartForm
        collection={Collections}
        documentId={props.documentId}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        showRemove={true}
        fragment={getFragment('CollectionsPageFragment')}
        queryFragment={getFragment('CollectionsPageFragment')}
        mutationFragment={getFragment('CollectionsPageFragment')}
      />
    </div>
  )
}

registerComponent('CollectionsEditForm', CollectionsEditForm, withMessages);
