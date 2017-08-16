/*

A component to configure the "Edit Title" form.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, getFragment } from "meteor/vulcan:core";
import Conversations from '../collections/conversations/collection.js';

const TitleEditForm = props =>{
  console.log("TitleEdit Form props: ",  props);
  return <Components.SmartForm
    collection={Conversations}
    documentId={props.documentId}
    fragment={getFragment('conversationsListFragment')}
    queryFragment={getFragment('conversationsListFragment')}
    mutationFragment={getFragment('conversationsListFragment')}
    successCallback={document => {
      props.closeModal();
    }}
  />
}

registerComponent('TitleEditForm', TitleEditForm);
