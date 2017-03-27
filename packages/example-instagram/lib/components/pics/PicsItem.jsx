/* 

An item in the pics list.
Wrapped with the "withCurrentUser" container.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import PicsDetail from './PicsDetails.jsx';
import PicsImage from './PicsImage.jsx';

const PicsItem = ({pic, currentUser}) =>

  <div className="pics-item">

    {/* document properties */}
    
    <Components.ModalTrigger className="pics-details-modal" component={<PicsImage imageUrl={pic.imageUrl} />}>
      <PicsDetail documentId={pic._id} currentUser={currentUser} />
    </Components.ModalTrigger>

    <div className="pics-meta">

      <div className="pics-comment-count">
        <Components.Icon name="comment" /> {pic.commentsCount}
      </div>
      
    </div>

  </div>

export default PicsItem;