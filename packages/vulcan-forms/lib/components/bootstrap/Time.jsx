import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime';
import { registerComponent } from 'meteor/vulcan:core';

class Time extends PureComponent {
  
  constructor(props) {
    super(props);
    this.updateDate = this.updateDate.bind(this);
  }

  // when the datetime picker has mounted, SmartForm will catch the date value (no formsy mixin in this component)
  // componentDidMount() {
  //   if (this.props.value) {
  //     this.context.updateCurrentValues({[this.props.path]: this.props.value});
  //   }
  // }

  updateDate(mDate) {
    // if this is a properly formatted moment date, update time
    if (typeof mDate === 'object') {
      this.context.updateCurrentValues({[this.props.path]: mDate.format('HH:mm')});
    }
  }

  render() {

    const date = new Date();

    // transform time string into date object to work inside datetimepicker
    const time = this.props.value;
    if (time) {
      date.setHours(parseInt(time.substr(0,2)), parseInt(time.substr(3,5)));
    } else {
      date.setHours(0,0);
    }

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <DateTimePicker
            value={date}
            viewMode="time"
            dateFormat={false}
            timeFormat="HH:mm"
            // newDate argument is a Moment object given by react-datetime
            onChange={newDate => this.updateDate(newDate)}
            inputProps={{name: this.props.name}}
          />
        </div>
      </div>
    );
  }
}

Time.propTypes = {
  control: PropTypes.any,
  datatype: PropTypes.any,
  group: PropTypes.any,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
};

Time.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

export default Time;

registerComponent('FormComponentTime', Time);