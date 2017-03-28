/* 

An item in the pics list.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

import PicsDetail from './PicsDetails.jsx';

const PicsItem = ({pic, currentUser}) =>

  <div className="pics-item">

    <Components.ModalTrigger className="pics-details-modal" component={<div className="pics-image"><img src={pic.imageUrl}/></div>}>
      <PicsDetail documentId={pic._id} currentUser={currentUser} />
    </Components.ModalTrigger>

    <div className="pics-meta">

      <div className="pics-comment-count">
        <Components.Icon name="comment" /> {pic.commentsCount}
      </div>
      
    </div>

  </div>

export default PicsItem;