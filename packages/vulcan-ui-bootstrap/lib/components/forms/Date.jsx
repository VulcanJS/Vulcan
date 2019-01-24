import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime';
import { Components, registerComponent } from 'meteor/vulcan:core';

class DateComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.updateDate = this.updateDate.bind(this);
  }

  updateDate(date) {
    this.context.updateCurrentValues({ [this.props.path]: date });
  }

  render() {
    const date = this.props.value
      ? typeof this.props.value === 'string'
        ? new Date(this.props.value)
        : this.props.value
      : null;

    return (
      <Components.FormItem {...this.props.inputProperties}>
        <DateTimePicker
          value={date}
          timeFormat={false}
          // newDate argument is a Moment object given by react-datetime
          onChange={newDate => this.updateDate(newDate)}
          inputProps={{ name: this.props.name }}
        />
      </Components.FormItem>
    );
  }
}

DateComponent.propTypes = {
  control: PropTypes.any,
  datatype: PropTypes.any,
  group: PropTypes.any,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
};

DateComponent.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

export default DateComponent;

registerComponent('FormComponentDate', DateComponent);
