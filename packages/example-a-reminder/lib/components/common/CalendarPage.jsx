import React from 'react';
import { Components, registerComponent, ModalTrigger, withCurrentUser } from 'meteor/vulcan:core';
import Calendar from 'react-widgets/lib/Calendar';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
import Moment from 'moment';

momentLocalizer(Moment);

const canCreateNewReminder = Reminders.options.mutations.new.check(
  this.props.currentUser
);

renderNew() {

  const component = (
    <div className="add-reminder">
      <ModalTrigger
        title="Add Reminder"
        component={<Button bsStyle="primary">Add Reminder</Button>}
      >
        <Components.RemindersNewForm />
      </ModalTrigger>
      <hr/>
    </div>
  )

  return !!this.props.currentUser ? component : null;
}

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
    {canCreateNewReminder ? this.renderNew() : null}
  )
}

registerComponent('CalendarPage', CalendarPage);
