import React, { PropTypes, Component } from 'react';
import DateTimeField from 'react-bootstrap-datetimepicker';
import Row from './row.js';
import ComponentMixin from './component.js';
import moment from 'moment';

class DateTime extends Component {

  render() {

    const date = this.props.value ? moment(this.props.value).format("x") : moment().format("x");
    // console.log(this)
    // console.log(date)

    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9"><DateTimeField dateTime={date} format={"x"} inputProps={{name: this.props.name}}/></div>
      </div>
    )
  }
}

DateTime.propTypes = {
  label: React.PropTypes.string,
  value: React.PropTypes.any
}

export default DateTime;