import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import Calendar from 'react-widgets/lib/Calendar';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Moment from 'moment';
momentLocalizer(Moment);

const CalendarPage = () => {
  return (
    <div>
      <h1>Calendar</h1>
        <Calendar  defaultValue={new Date()} footer={true} />
    </div>
  )
}

registerComponent('CalendarPage', CalendarPage);
