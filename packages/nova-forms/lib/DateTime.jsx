import React, { PropTypes, Component } from 'react';
import DateTimePicker from 'react-datetime';
// import moment from 'moment';

class DateTime extends Component {
  
  constructor(props) {
    super(props);
    
    this.updateDate = this.updateDate.bind(this);
  }

  // when the datetime picker has mounted, SmartForm will catch the date value (no formsy mixin in this component)
  componentDidMount() {
    this.updateDate(this.props.value || new Date(), true);
  }

  updateDate(date, isDefault=false) {
    // this.context.updateCurrentValues({[this.props.name]: date});
    this.props.onChange(this.props.name, date, isDefault);
  }

  render() {
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <DateTimePicker
            value={this.props.value}
            // newDate argument is a Moment object given by react-datetime
            onChange={newDate => this.updateDate(newDate._d)}
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
  updateCurrentValues: React.PropTypes.func,
};

export default DateTime;
