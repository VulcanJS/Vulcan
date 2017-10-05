/* 

An item in the comments list.

Note: Comments.options.mutations.edit.check is defined in 
modules/comments/mutations.js and is used both on the server when
performing the mutation, and here to check if the form link
should be displayed. 

*/

import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import Comments from '../../modules/comments/collection.js';

const CommentsItem = ({comment, currentUser, pic}) =>

  <div className={`comments-item ${comment.isDeleted ? 'comments-item-deleted' : ''}`}>

    <h4 className="comments-item-author">{comment.user && comment.user.displayName}</h4>
    
    <p className="comments-item-body">{comment.body}</p>
    
    {Comments.options.mutations.edit.check(currentUser, comment, pic) ? 
      <Components.ModalTrigger component={<Components.Icon name="edit" />}>
        <Components.CommentsEditForm currentUser={currentUser} documentId={comment._id} />
      </Components.ModalTrigger>
      : null
    }

  </div>

registerComponent('CommentsItem', CommentsItem);