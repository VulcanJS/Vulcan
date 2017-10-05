import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

const CommentsNode = ({ comment, currentUser }) =>
  <div className="comments-node">
    <Components.CommentsItem currentUser={currentUser} comment={comment} key={comment._id} />
    {comment.childrenResults ? 
      <div className="comments-children">
        {comment.childrenResults.map(comment => <CommentsNode currentUser={currentUser} comment={comment} key={comment._id} />)}
      </div>
      : null
    }
  </div>

CommentsNode.propTypes = {
  comment: PropTypes.object.isRequired, // the current comment
};

registerComponent('CommentsNode', CommentsNode);
