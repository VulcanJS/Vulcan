/* 

A component to configure the "new pic" form.

We're using Pics.options.mutations.new.check (defined in modules/pics/mutations.js)
to check if the user has the proper permissions to actually insert a new picture. 

*/

import React from 'react';
import { Components, registerComponent, getFragment, withAccess } from 'meteor/vulcan:core';

const PicsNewForm = ({currentUser, closeModal}) => (
  <div>
      <Components.SmartForm
        collectionName="Pics"
        mutationFragment={getFragment('PicsItemFragment')}
        successCallback={closeModal}
      />
  </div>
);

const accessOptions = {
  groups: ['customers', 'admins'],
};

registerComponent('PicsNewForm', PicsNewForm, [withAccess, accessOptions]);
