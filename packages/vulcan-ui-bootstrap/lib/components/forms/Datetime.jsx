import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-datetime';
import { mergeWithComponents, registerComponent } from 'meteor/vulcan:core';

class DateTime extends PureComponent {
  constructor(props) {
    super(props);
    this.updateDate = this.updateDate.bind(this);
  }

  updateDate(date) {
    this.context.updateCurrentValues({ [this.props.path]: date });
  }

  render() {

    const { inputProperties, disabled = false, formComponents } = this.props;

    const Components = mergeWithComponents(formComponents);

    const date = this.props.value
      ? typeof this.props.value === 'string'
        ? new Date(this.props.value)
        : this.props.value
      : null;

    return (
      <Components.FormItem path={inputProperties.path} label={inputProperties.label} {...this.props.itemProperties}>
        <DateTimePicker
          value={date}
          // newDate argument is a Moment object given by react-datetime
          onChange={newDate => this.updateDate(newDate._d)}
          format={'x'}
          inputProps={{ name: this.props.name, disabled }}
        />
      </Components.FormItem>
    );
  }
}

DateTime.propTypes = {
  input: PropTypes.any,
  datatype: PropTypes.any,
  group: PropTypes.any,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
};

DateTime.contextTypes = {
  updateCurrentValues: PropTypes.func,
};

export default DateTime;

registerComponent('FormComponentDateTime', DateTime);
