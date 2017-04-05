/* 

A component to configure the "new pic" form.

*/

import React, { PropTypes, Component } from 'react';
import { Components, registerComponent, withCurrentUser, getFragment } from 'meteor/vulcan:core';

import Pics from '../../modules/pics/collection.js';

const PicsNewForm = ({currentUser}) =>

  <div>

    {Pics.options.mutations.new.check(currentUser) ?
      <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #ccc'}}>
        <h4>Insert New Document</h4>
        <Components.SmartForm 
          collection={Pics}
          mutationFragment={getFragment('PicsItemFragment')}
        /> 
      </div> :
      null
    }

  </div>

export default withCurrentUser(PicsNewForm);