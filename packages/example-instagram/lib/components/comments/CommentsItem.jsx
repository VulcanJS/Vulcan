/* 

An item in the comments list.
Wrapped with the "withCurrentUser" container.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import Comments from '../../modules/comments/collection.js';
import CommentsEditForm from './CommentsEditForm.jsx';

const CommentsItem = ({comment, currentUser}) =>

  <div className="comments-item">

    <h4 className="comments-item-author">{comment.user && comment.user.displayName}</h4>
    
    <p className="comments-item-body">{comment.body}</p>
    
    {Comments.options.mutations.edit.check(currentUser, comment) ? 
      <Components.ModalTrigger component={<Components.Icon name="edit" />}>
        <CommentsEditForm currentUser={currentUser} documentId={comment._id} />
      </Components.ModalTrigger>
      : null
    }

  </div>

export default CommentsItem;