/* 

An item in the pics list.

*/

import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import PicsDetail from './PicsDetails.jsx';

const PicsItem = ({pic, currentUser}) =>

  <div className="pics-item">

    <Components.ModalTrigger className="pics-details-modal" component={<div className="pics-image"><img alt={pic.body} src={pic.imageUrl}/></div>}>
      <PicsDetail documentId={pic._id} currentUser={currentUser} />
    </Components.ModalTrigger>

  </div>

export default PicsItem;