import React, { PropTypes, Component } from 'react';
import { Components, withDocument, registerComponent } from 'meteor/vulcan:core';
// Libraries
import moment from 'moment';
// Collections
import Sequences from '../collections/sequences/collection.js';
import Collections from '../collections/collections/collection.js';

const CollectionsPage = ({document, currentUser, loading}) => {
  return (<div className="collections-page">
  <div></div>
  </div>);
};

const options = {
  collection: Collections,
  fragmentName: 'CollectionPageFragment'
};

registerComponent('CollectionsPage', CollectionsPage, withDocument(options));
