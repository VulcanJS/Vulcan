import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

class Sidebar extends Component {

  render() {
    return (
      <div>
        <Components.RecentComments />
      </div>
    )
  }

}

registerComponent('Sidebar', Sidebar);
