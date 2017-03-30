/* 

A component to configure the "new pic" form.

We're using Pics.options.mutations.new.check (defined in modules/pics/mutations.js)
to check if the user has the proper permissions to actually insert a new picture. 

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser, getFragment } from 'meteor/vulcan:core';

import Pics from '../../modules/pics/collection.js';

const PicsNewForm = ({currentUser, closeModal}) =>

  <div>

    {Pics.options.mutations.new.check(currentUser) ?
      <Components.SmartForm 
        collection={Pics}
        mutationFragment={getFragment('PicsItemFragment')}
        successCallback={closeModal}
      /> :
      null
    }

  </div>

export default withCurrentUser(PicsNewForm);