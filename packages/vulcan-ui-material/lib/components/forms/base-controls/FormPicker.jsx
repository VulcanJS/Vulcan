import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import { withStyles } from '@material-ui/core/styles';
import ComponentMixin from './mixins/component';
import FormControlLayout from './FormControlLayout';
import FormHelper from './FormHelper';
import TextField from '@material-ui/core/TextField';

import moment from 'moment';
//import 'moment-timezone';

const dateFormat = 'YYYY-MM-DD';

export const styles = theme => ({
  inputRoot: {
    'marginTop': '16px',
    '& .clear-button.has-value': { opacity: 0 },
    '&:hover .clear-button.has-value': { opacity: 0.54 },
  },
  inputFocused: {
    '& .clear-button.has-value': { opacity: 0.54 }
  },
  inputDisabled: {},
});

//noinspection JSUnusedGlobalSymbols
const FormPicker = createReactClass({

  mixins: [ComponentMixin],

  displayName: 'FormPicker',

  propTypes: {
    type: PropTypes.oneOf([
      'date',
      'datetime',
      'datetime-local',
    ]),
    errors: PropTypes.array,
    placeholder: PropTypes.string,
    formatValue: PropTypes.func,
    hideClear: PropTypes.bool,
  },

  getDefaultProps: function () {
    return {
      type: 'date',
    };
  },

  handleChange: function (event) {
    let value = event.target.value;
    if (this.props.scrubValue) {
      value = this.props.scrubValue(value, this.props);
    }
    this.props.handleChange(value);
  },

  render: function () {
    const { classes, disabled, autoFocus } = this.props;
    const value = moment(this.props.value, dateFormat, true).isValid() ? this.props.value : moment(this.props.value).format(dateFormat);

    const options = this.props.options || {};

    return (
      <FormControlLayout {...this.getFormControlProperties()} htmlFor={this.getId()}>
        <TextField
            ref={c => (this.element = c)}
            {...this.cleanProps(this.props)}
            id={this.getId()}
            value={value}
            autoFocus={options.autoFocus || autoFocus}
            onChange={this.handleChange}
            disabled={disabled}
            placeholder={this.props.placeholder}
            classes={{ root: classes.inputRoot }}
        />
        <FormHelper {...this.getFormHelperProperties()}/>
      </FormControlLayout>
    );
  }
});


export default withStyles(styles)(FormPicker);
