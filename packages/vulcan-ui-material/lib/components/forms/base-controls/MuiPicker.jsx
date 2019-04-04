import React from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';
import withStyles from '@material-ui/core/styles/withStyles';
import ComponentMixin from './mixins/component';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import TextField from '@material-ui/core/TextField';

import moment from 'moment';
//import 'moment-timezone';

const dateFormat = 'YYYY-MM-DD';

export const styles = theme => ({
  inputRoot: {
    'marginTop': '16px',
    '& .clear-enabled': { opacity: 0 },
    '&:hover .clear-enabled': { opacity: 0.54 },
  },
  inputFocused: {
    '& .clear-enabled': { opacity: 0.54 }
  },
});

//noinspection JSUnusedGlobalSymbols
const MuiPicker = createReactClass({

  mixins: [ComponentMixin],

  displayName: 'MuiPicker',

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
      value = this.props.scrubValue(value);
    }
    this.props.onChange(value);
  },

  render: function () {
    const { classes, disabled, autoFocus } = this.props;
    const value = moment(this.props.value, dateFormat, true).isValid() ? this.props.value : moment(this.props.value).format(dateFormat);

    const options = this.props.options || {};

    return (
      <MuiFormControl {...this.getFormControlProperties()} htmlFor={this.getId()}>
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
        <MuiFormHelper {...this.getFormHelperProperties()}/>
      </MuiFormControl>
    );
  }
});


export default withStyles(styles)(MuiPicker);
