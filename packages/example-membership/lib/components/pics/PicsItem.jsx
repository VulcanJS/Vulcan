/* 

An item in the pics list.

*/

import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

const PicsItem = ({pic, currentUser}) =>

  <div className="pics-item">

    <Components.ModalTrigger className="pics-details-modal" component={<div className="pics-image"><img alt={pic.body} src={pic.imageUrl}/></div>}>
      <Components.PicsDetails documentId={pic._id} currentUser={currentUser} />
    </Components.ModalTrigger>

  </div>

registerComponent('PicsItem', PicsItem);