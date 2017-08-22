import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React from 'react';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import Chapters from '../../lib/collections/chapters/collection.js';

//TODO: Manage chapter removal to remove the reference from all parent-sequences

const ChaptersEditForm = (props) => {
  return (
    <div className="chapters-edit-form">
      <Components.SmartForm
        collection={Chapters}
        documentId={props.documentId}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        showRemove={true}
        fragment={getFragment('ChaptersFragment')}
        queryFragment={getFragment('ChaptersFragment')}
        mutationFragment={getFragment('ChaptersFragment')}
      />
    </div>
  )
}

registerComponent('ChaptersEditForm', ChaptersEditForm, withMessages);
