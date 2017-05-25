import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime';

class DateTime extends PureComponent {
  
  constructor(props) {
    super(props);
    
    this.updateDate = this.updateDate.bind(this);
  }

  // when the datetime picker has mounted, SmartForm will catch the date value (no formsy mixin in this component)
  componentDidMount() {
    this.updateDate(this.props.value || new Date());
  }

  updateDate(date) {
    this.context.updateCurrentValues({[this.props.name]: date});
  }

  render() {

    const date = typeof this.props.value === 'string' ? new Date(this.props.value) : this.props.value;
    
    return (
      <div className="form-group row">
        <label className="control-label col-sm-3">{this.props.label}</label>
        <div className="col-sm-9">
          <DateTimePicker
            value={date || new Date()}
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
  control: PropTypes.any,
  datatype: PropTypes.any,
  group: PropTypes.any,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
};

DateTime.contextTypes = {
  addToAutofilledValues: PropTypes.func,
  updateCurrentValues: PropTypes.func,
};

export default DateTime;
