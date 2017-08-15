import { Components, registerComponent, withDocument } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Comments from 'meteor/vulcan:comments';

const CommentInlineWrapper = ({ document, currentUser}) => {
  if (document) {
    return (
      <div className="comment-inline-wrapper">
        <Components.CommentInline comment={document} currentUser={currentUser} />
      </div>
    )
  } else {
    return (
      <Components.Loading />
    )
  }
}


const options = {
  collection: Comments,
  queryName: 'CommentInlineQuery',
  fragmentName: 'commentInlineFragment',
};

registerComponent('CommentInlineWrapper', CommentInlineWrapper, withDocument(options));
