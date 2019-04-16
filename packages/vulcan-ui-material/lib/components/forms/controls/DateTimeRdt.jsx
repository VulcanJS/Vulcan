// Deprecated react-datetime version

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime';
import { registerComponent } from 'meteor/vulcan:core';


class DateTimeRdt extends PureComponent {
  
  constructor(props) {
    super(props);
    this.updateDate = this.updateDate.bind(this);
  }

  // when the datetime picker has mounted, SmartForm will catch the date value (no formsy mixin in this component)
  componentDidMount() {
    if (this.props.inputProperties.value) {
      this.updateDate(this.props.inputProperties.value);
    }
  }

  updateDate(date) {
    this.context.updateCurrentValues({[this.props.inputProperties.name]: date});
  }

  render() {

    const { value, label } = this.props.inputProperties;
    const date = value ? (typeof value === 'string' ? new Date(value) : value) : null;
    
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{label}</label>
        <div className="col-sm-9">
          <DateTimePicker
            value={date}
            // newDate argument is a Moment object given by react-datetime
            onChange={newDate => this.updateDate(newDate._d)}
            format={'x'}
            inputProps={this.props.inputProperties}
          />
        </div>
      </div>
    );
  }
}

DateTimeRdt.propTypes = {
  control: PropTypes.any,
  datatype: PropTypes.any,
  group: PropTypes.any,
  inputProperties: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any,
    name: PropTypes.string.isRequired
  }),
};

DateTimeRdt.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

export default DateTimeRdt;
