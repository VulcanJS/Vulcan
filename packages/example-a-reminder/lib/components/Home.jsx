import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';

const Home = () => {
  return (
    <div>
      <h1>Reminder App</h1>
      <p>go to your <Link to="/calendar">Calendar</Link> to set a email reminder</p>
    </div>
  )
};

registerComponent('Home', Home);
