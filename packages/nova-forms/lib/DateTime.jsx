import React, { PropTypes, Component } from 'react';
import DateTimePicker from 'react-datetime';
import moment from 'moment';

class DateTime extends Component {
  // when the datetime picker mounts, NovaForm will catch the date value (no formsy mixin in this component)
  componentWillMount() {
    this.context.addToAutofilledValues({[this.props.name]: this.props.value || new Date()});
  }

  render() {
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <DateTimePicker 
            value={this.props.value || new Date()}
            // newDate argument is a Moment object given by react-datetime
            onChange={newDate => { this.context.addToAutofilledValues({[this.props.name]: newDate._d}) }}
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
  name: React.PropTypes.string,
  value: React.PropTypes.any,
};

DateTime.contextTypes = {
  addToAutofilledValues: React.PropTypes.func,
  updateCurrentValue: React.PropTypes.func,
};

export default DateTime;
