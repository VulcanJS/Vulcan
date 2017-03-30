/* 

A component that shows a detailed view of a single picture. 
Wrapped with the "withDocument" container.

*/

import React, { PropTypes, Component } from 'react';
import Pics from '../../modules/pics/collection.js';
import { Components, withDocument } from 'meteor/vulcan:core';
import CommentsList from '../comments/CommentsList.jsx';
import CommentsNewForm from '../comments/CommentsNewForm.jsx';
import PicsEditForm from './PicsEditForm.jsx';
import Comments from '../../modules/comments/collection.js';

const PicsDetails = ({loading, document, currentUser}) => {

  if (loading) {
  
    return <p>Loading…</p>
  
  } else {
  
    return (

      <div className="pics-details">

        <div className="pics-details-image"><img src={document.imageUrl}/></div>
        
        <div className="pics-details-sidebar">
          
          <div className="pics-info">
          
            <h4 className="pics-author">{document.user.displayName}</h4>

            <div className="pics-body">

              {document.body}

              {Pics.options.mutations.edit.check(currentUser, document) ? 
                <Components.ModalTrigger component={<Components.Icon name="edit"/>}>
                  <PicsEditForm currentUser={currentUser} documentId={document._id} />
                </Components.ModalTrigger>
                : null
              }

            </div>

          </div>

          <CommentsList terms={{view: 'picComments', picId: document._id}} />
        
          {Comments.options.mutations.new.check(currentUser) ?
            <CommentsNewForm picId={document._id} /> :
            null
          }

        </div>
      
      </div>

    )
  }
}

const options = {
  collection: Pics,
  fragmentName: 'PicsDetailsFragment',
};

export default withDocument(options)(PicsDetails);
