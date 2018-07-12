import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

const Layout = () => {
  return (
    <div>
      <h1>Reminder App</h1>
      <Components.CalendarPage />
    </div>
  )
};

registerComponent('Layout', Layout);
export default Layout;
