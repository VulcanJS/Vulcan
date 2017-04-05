/* 

A component to configure the "new comment" form.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser, getFragment } from 'meteor/vulcan:core';

import Comments from '../../modules/comments/collection.js';

const CommentsNewForm = ({currentUser, picId}) =>

  <div className="comments-new-form">

      <Components.SmartForm 
        collection={Comments}
        mutationFragment={getFragment('CommentsItemFragment')}
        prefilledProps={{picId}}
      />

  </div>

export default withCurrentUser(CommentsNewForm);