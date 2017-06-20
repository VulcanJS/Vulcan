import React, { Component } from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';

class Sidebar extends Component {

  render() {
    return (
      <div>
        <Components.RecentComments terms={{view: 'recentComments', limit: 5}} fontSize="small" />
        <Components.TopContributors />
      </div>
    )
  }

}

registerComponent('Sidebar', Sidebar);
