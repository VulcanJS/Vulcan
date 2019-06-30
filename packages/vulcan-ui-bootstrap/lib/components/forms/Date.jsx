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
    const { inputProperties, disabled = false  } = this.props;

    const date = this.props.value
      ? typeof this.props.value === 'string'
        ? new Date(this.props.value)
        : this.props.value
      : null;

    return (
      <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...this.props.itemProperties}>
        <DateTimePicker
          value={date}
          timeFormat={false}
          // newDate argument is a Moment object given by react-datetime
          onChange={newDate => this.updateDate(newDate)}
          inputProps={{ name: this.props.name, disabled }}
        />
      </Components.FormItem>
    );
  }
}

DateComponent.propTypes = {
  input: PropTypes.any,
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
