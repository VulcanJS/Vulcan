import { Components, registerComponent, getFragment, withMessages } from 'meteor/vulcan:core';
import React from 'react';
import PropTypes from 'prop-types';
import Books from '../../lib/collections/books/collection.js';

const BooksEditForm = (props) => {
  return (
    <div className="books-edit-form">
      <Components.SmartForm
        collection={Books}
        documentId={props.documentId}
        successCallback={props.successCallback}
        cancelCallback={props.cancelCallback}
        prefilledProps={props.prefilledProps}
        fragment={getFragment('BookPageFragment')}
        queryFragment={getFragment('BookPageFragment')}
        mutationFragment={getFragment('BookPageFragment')}
      />
    </div>
  )
}

registerComponent('BooksEditForm', BooksEditForm, withMessages);
