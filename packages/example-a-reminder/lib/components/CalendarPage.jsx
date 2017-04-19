import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';

const CalendarPage = () => {
  return (
    <div>
      <h1>Calendar</h1>
      <p>stuff</p>
    </div>
  )
}

registerComponent('CalendarPage', CalendarPage);
