/* Replace the newsletter with an empty component. */

import { replaceComponent }from 'meteor/vulcan:core';
import React, { Component } from 'react';

class LWNewsletter extends Component {

  render() {
    return (
      <div></div>
    )
  }

}

replaceComponent('Newsletter', LWNewsletter);
