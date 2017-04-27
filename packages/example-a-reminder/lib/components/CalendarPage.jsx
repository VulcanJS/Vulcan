import React from 'react';
import { Components, registerComponent } from 'meteor/vulcan:core';
import Calendar from 'react-widgets/lib/Calendar';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Moment from 'moment';

momentLocalizer(Moment);


class reminderDayComponent extends React.Component{
  render() {
    const date = this.props.date;
    //future dates styled, change to indicator for reminders on that day
    const style =  { backgroundColor: date > new Date() && '#F57B7B'} ;
    return (
      <div style={style}>
        {this.props.label}
      </div>
    );
  }
}

const CalendarPage = () => {
  return (
    <div>
      <h1>Calendar</h1>
        <Calendar  defaultValue={new Date()} footer={true} label={"stuff"} dayComponent={reminderDayComponent} />
    </div>
  )
}
registerComponent('CalendarPage', CalendarPage);
