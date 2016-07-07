import React, { PropTypes, Component } from 'react';
import DateTimeField from 'react-datetime';
import moment from 'moment';

class DateTime extends Component {
  render() {
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <DateTimeField 
            value={this.props.value || new Date()}
            defaultValue={moment().format("x")}
            onChange={newDate => this.props.updateCurrentValue(this.props.name, newDate._d)}
            format={"x"} 
            inputProps={{name: this.props.name}}
          />
        </div>
      </div>
    );
  }
}

DateTime.propTypes = {
  control: React.PropTypes.any,
  datatype: React.PropTypes.any,
  group: React.PropTypes.any,
  label: React.PropTypes.string,
  updateCurrentValue: React.PropTypes.func,
  name: React.PropTypes.string,
  value: React.PropTypes.any,
}

export default DateTime;